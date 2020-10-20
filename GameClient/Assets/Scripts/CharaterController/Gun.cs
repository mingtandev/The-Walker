using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Gun : MonoBehaviour
{
    //REFERENCE
    UIManager myUI;


    //This class create to apply gravity physic for bullet
    class BulletGravity
    {
        public float time;
        public Vector3 initPosition;
        public Vector3 initialVelocity;
        public TrailRenderer tracer;
    }



    public enum typeGun
    {
        Sniper,
        Submachine,
        Rifle,
        Automatic,
        Shotgun
    }


    // Gun property
    public ParticleSystem muzzle;
    public GameObject blood;
    public TrailRenderer bulletTrail;
    public GameObject barrel;
    public ParticleSystem hitFX;
    public AnimationClip weaponAnimation;
    RaycastHit hit;
    Ray ray;
    Transform crossHairTarget;
    float maxLifeTime = 3f;



    public int curAmmo;
    public int loadAmmo;
    public int totalAmmo;
    public string nameGun;
    public typeGun type;


    //Gun process
    float currenTime = 0f;
    public float timeDelay;
    public int damage;
    public float bulletSpeed;
    public float bulletDrop;

    [HideInInspector]
    public bool readyToUse;
    public bool canShot;
    public bool isReaload;
    public bool canReload = true;

    List<BulletGravity> bullets = new List<BulletGravity>();

    private void Awake()
    {
        // muzzle.Stop();
        curAmmo = loadAmmo;
        myUI = GameObject.FindGameObjectWithTag("UIManager").GetComponent<UIManager>();
        crossHairTarget = GameObject.FindGameObjectWithTag("Player").GetComponent<MyPlayerController>().CrossHairTarget;
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
            // isReaload = true;
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
        if (canReload && !isReaload)
        {

            StartCoroutine(myUI.reloadUpdateFill(2f));

            canShot = false;
            readyToUse = false;
            isReaload = true;
            SoundManager.instance.Play("ReloadStart");

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
            SoundManager.instance.Play("ReloadComplete");
        }
        yield return null;
    }

    public void PlaySoundGun()
    {

        SoundManager.instance.Play(nameGun);


    }


    public void GunShotHandle()
    {
        PlaySoundGun();
        muzzle.Play();


        ray.origin = barrel.transform.position;
        ray.direction = crossHairTarget.position - barrel.transform.position;

        Vector3 vel = ray.direction.normalized * bulletSpeed;
        var bullet = CreateBullet(ray.origin, vel);  //this bullet we will apply gravity
        bullets.Add(bullet);


        ResetTimeBullet();
    }

    Vector3 GetPosition(BulletGravity bullet)
    {
        // p + v*t + 1/2*g*t^2
        Vector3 gravity = Vector3.down * bulletDrop;

        return bullet.initPosition + bullet.initialVelocity * bullet.time + 0.5f * gravity * bullet.time * bullet.time;
    }


    BulletGravity CreateBullet(Vector3 pos, Vector3 vel)
    {
        BulletGravity bullet = new BulletGravity();
        bullet.initPosition = pos;
        bullet.initialVelocity = vel;
        bullet.time = 0;
        bullet.tracer = Instantiate(bulletTrail, pos, Quaternion.identity);
        bullet.tracer.AddPosition(pos);
        return bullet;
    }


    public void UpdateGravityBullets(float deltatime)
    {
        bullets.ForEach(bullet =>  //Tai moi vien dan , sau thoi gian t cap nhat lai raycast
        {
            Vector3 start = GetPosition(bullet);
            bullet.time += deltatime;
            Vector3 end = GetPosition(bullet);


            //RaycastSegment
            Vector3 direc = end - start;
            float Distance = direc.magnitude;
            ray.origin = start;
            ray.direction = direc;

            if (Physics.Raycast(ray, out hit, Distance))
            {
                bullet.time = maxLifeTime;
                if(bullet.tracer)
                    bullet.tracer.transform.position = hit.point;
                if (1 << hit.transform.gameObject.layer != LayerMask.GetMask("EnemyLayer"))
                {
                    hitFX.transform.position = hit.point;
                    hitFX.transform.forward = hit.normal;
                    hitFX.Emit(1);
                }
                else
                {
                    GameObject Theblood = Instantiate(blood, hit.point, Quaternion.LookRotation(hit.normal));
                    hit.transform.gameObject.GetComponent<Enemy>().heath -= damage;
                    Destroy(Theblood, 1f);
                }

            }
            else
            {
                if(bullet.tracer)
                    bullet.tracer.transform.position = end;
            }


        });


        DestroyBullet();
    }



    void DestroyBullet()
    {
        bullets.RemoveAll(bullet => bullet.time > maxLifeTime);
    }

    IEnumerator UnactiveBullet(GameObject obj, float time)
    {
        yield return new WaitForSeconds(time);
        obj.SetActive(false);

    }
}
