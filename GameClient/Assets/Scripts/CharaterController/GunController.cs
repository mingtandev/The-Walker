using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GunController : MonoBehaviour
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
    int originTotalAmmo;
    public string nameGun;
    public typeGun type;


    //Gun process
    float currenTime = 0f;
    public float timeDelay;
    public int damage;
    public float bulletSpeed;
    public float bulletDrop;

    public Vector3 posOfSlotGun;

    [HideInInspector]
    public bool readyToUse;
    public bool canShot;
    public bool isReaload;
    public bool canReload = true;
    public GunRecoil recoil;

    List<BulletGravity> bullets = new List<BulletGravity>();


    private void Awake()
    {
        // muzzle.Stop();
        curAmmo = loadAmmo;
        myUI = GameObject.FindGameObjectWithTag("UIManager").GetComponent<UIManager>();
        crossHairTarget = GameObject.FindGameObjectWithTag("Player").GetComponent<MyPlayerController>().CrossHairTarget;
        recoil = GetComponent<GunRecoil>();
        originTotalAmmo = totalAmmo;
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
        StartCoroutine(LockRotation());
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
            MyPlayerController.instance.rigController.SetTrigger("Reload");

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
            MyPlayerController.instance.rigController.ResetTrigger("Reload");
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
        recoil.GenerateRecoil();
        if (type == typeGun.Shotgun)
        {
            for (int i = 0; i < 6; i++)
            {
                ray.origin = barrel.transform.position;
                ray.direction = crossHairTarget.position - barrel.transform.position;


                //GET ANGLE RANDOM

                ray.direction = Quaternion.AngleAxis(Random.Range(-10, 10), Vector3.up) * Quaternion.AngleAxis(Random.Range(-10, 10), Vector3.right) * ray.direction;
                Vector3 vel = ray.direction.normalized * bulletSpeed;
                var bullet = CreateBullet(ray.origin, vel);  //this bullet we will apply gravity
                bullets.Add(bullet);
            }
            ResetTimeBullet();

        }
        else
        {
            ray.origin = barrel.transform.position;
            ray.direction = crossHairTarget.position - barrel.transform.position;

            Vector3 vel = ray.direction.normalized * bulletSpeed;
            var bullet = CreateBullet(ray.origin, vel);  //this bullet we will apply gravity
            bullets.Add(bullet);


            ResetTimeBullet();
        }




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
        bullet.tracer = BulletPool.Instance.SpawnPool("BulletTrail", pos, Quaternion.identity).GetComponent<TrailRenderer>();
        bullet.tracer.Clear();
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
                if (bullet.tracer)
                    bullet.tracer.transform.position = hit.point;
                int mask = 1 << hit.transform.gameObject.layer;
                if (mask != LayerMask.GetMask("EnemyLayer"))
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
                if (bullet.tracer)
                    bullet.tracer.transform.position = end;
            }


        });


        DestroyBullet();
    }



    void DestroyBullet()
    {
        for(int i = 0 ; i < bullets.Count ; i++)
        {
            if(bullets[i].time > maxLifeTime)
            {
                bullets[i].tracer.transform.gameObject.SetActive(false);
                bullets.RemoveAt(i);
            }
        }
        // foreach (BulletGravity bullet in bullets)
        // {
        //     if (bullet != null)
        //     {
        //         if (bullet.time > maxLifeTime)
        //         {
        //             bullet.tracer.transform.gameObject.SetActive(false);
        //             bullets.Remove(bullet);
        //         }
        //     }
        // }
        // bullets.ForEach(bullet =>
        // {
        //     if (bullet.time > maxLifeTime)
        //     {
        //         bullets.Remove(bullet);
        //         bullet.tracer.transform.gameObject.SetActive(false);
        //     }
        // });
        //bullets.RemoveAll(bullet => bullet.time > maxLifeTime);
    }

    IEnumerator UnactiveBullet(GameObject obj, float time)
    {
        yield return new WaitForSeconds(time);
        obj.SetActive(false);

    }


    IEnumerator LockRotation()
    {
        transform.localRotation = Quaternion.Euler(0f, 0f, 0f);

        yield return new WaitForSeconds(0.5f);

        StartCoroutine(LockRotation());

    }

    public void AddTotalAmmo()
    {
        if (totalAmmo < originTotalAmmo)
        {
            totalAmmo += originTotalAmmo - totalAmmo;

            //ADD SOUND
        }
    }

}
