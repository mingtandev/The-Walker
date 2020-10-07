using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Gun : MonoBehaviour
{
    //REFERENCE
    UIManager myUI;

    public enum typeGun
    {
        Sniper,
        Submachine,
        Rifle,
        Automatic
    }


    // Gun property
    public ParticleSystem muzzle;
    public GameObject blood;
    public GameObject bulletTrail;
    public GameObject barrel;


    public int curAmmo;
    public int loadAmmo;
    public int totalAmmo;
    public string nameGun;
    public typeGun type;


    //Gun process
    float currenTime = 0f;
    public float timeDelay;
    public int damage;

    [HideInInspector]
    public bool readyToUse;
    public bool canShot;
    public bool isReaload;
    public bool canReload = true;



    private void Awake()
    {
        // muzzle.Stop();
        curAmmo = loadAmmo;
        myUI = GameObject.FindGameObjectWithTag("UIManager").GetComponent<UIManager>();
        // readyToUse = true;

    }

    private void OnEnable()
    {
        muzzle.Stop();
        readyToUse = true;
    }

    void Start()
    {
        currenTime = timeDelay;
    }

    // Update is called once per frame
    void Update()
    {
        currenTime += Time.deltaTime;
        if (currenTime > timeDelay)
        {
            canShot = true;
            currenTime = timeDelay;
        }

        CheckAmmoAndReload();
    }

    public void ResetTimeBullet()
    {
        currenTime = 0;
        canShot = false;
    }

    void CheckAmmoAndReload()
    {
        if (curAmmo <= 0)
        {
            canShot = false;
            isReaload = true;
        }

        if (curAmmo == loadAmmo || totalAmmo == 0)
        {
            canReload = false;
        }
        else
        {
            canReload = true;
        }

        if (Input.GetKey(KeyCode.R))
        {

            StartCoroutine(GunReload());
        }
    }

    IEnumerator GunReload()
    {
        if (canReload)
        {
            StartCoroutine(myUI.reloadUpdateFill(2f));

            canShot = false;
            readyToUse = false;

            yield return new WaitForSeconds(2f);

            isReaload = false;
            readyToUse = true;

            if (totalAmmo >= 0)
            {
                int add = loadAmmo - curAmmo;
                canShot = true;
                if (totalAmmo >= add)
                {
                    curAmmo += add;
                    totalAmmo -= add;
                }
                else
                {
                    curAmmo += totalAmmo;
                    totalAmmo = 0;
                    canShot = false;

                }
            }
            myUI.reload.transform.gameObject.SetActive(false);
        }
        yield return null;
    }

    // public void ShootTheBullet(Ray ShotRay, Quaternion followrotation)
    // {
    //     GameObject trailBullet = Instantiate(bulletTrail, barrel.transform.position, followrotation);
    //     trailBullet.SetActive(true);
    //     trailBullet.GetComponent<Rigidbody>().AddForce(ShotRay.direction * 5000f);
    //     Destroy(trailBullet, 0.095f);
    // }


    public void InstanitateMuzzle(Ray ShotRay, Quaternion followrotation)
    {
        // GameObject muzz = Instantiate(muzzle.transform.gameObject , barrel.transform.position , barrel.transform.rotation);
        // Destroy(muzz,1f);
        GameObject bullet = BulletPool.Instance.SpawnPool("BulletTrail", barrel.transform.position, followrotation);
        bullet.GetComponent<Rigidbody>().velocity = Vector3.zero;
        bullet.GetComponent<Rigidbody>().AddForce(ShotRay.direction * 5000f);
        StartCoroutine(UnactiveBullet(bullet, 0.095f));
    }


    IEnumerator UnactiveBullet(GameObject obj, float time)
    {
        yield return new WaitForSeconds(time);
        obj.SetActive(false);

    }
}
