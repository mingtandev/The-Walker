using System.Collections;
using System.Collections.Generic;
using UnityEngine;
// using SimpleJSON;
using UnityEngine.Networking;
using UnityEditor.Animations;

public class MyPlayerController : MonoBehaviour
{
    // Start is called before the first frame update
    Animator anim;
    public Animator rigController;
    Rigidbody rid;
    Camera cameraMain;


    //Shoot
    [HideInInspector]
    public bool isAiming = true;
    [HideInInspector]
    public Gun MyGun; //The current gun

    Gun firstGun;
    Gun secondGun;
    public Transform CrossHairTarget;



    //Movement field
    Vector3 moveDir;
    Vector3 rotateDir; //same above but y = 0 (not moving to sky)
    float moveSpeed = 1.5f;  // run is 4.5
    Quaternion rot;
    GameObject target;

    //Jump
    bool isGround = true;
    float jumpForce = 3f;
    LayerMask ground;

    //SAVE THE IK TO AUDIOCLIP
    public Transform WeaponParent;
    public Transform WeaponLeftIK;
    public Transform WeaponRightIK;

    //--------------------------------------------------------------------------------------------------------------------------------------------
    //NEW



    private void Awake()
    {
        cameraMain = Camera.main;
        Cursor.visible = false;
        ground = LayerMask.GetMask("GroundLayer");
        rid = GetComponent<Rigidbody>();
        anim = GetComponent<Animator>();

        moveDir = Vector3.forward;
        target = GameObject.FindGameObjectWithTag("TargetFollow");
    }

    void Start()
    {
        firstGun = SaveLoadManager.chooseGun[0].gun.GetComponent<Gun>();
        secondGun = SaveLoadManager.chooseGun[1].gun.GetComponent<Gun>();
        secondGun.gameObject.SetActive(false);
        MyGun = firstGun;
    }

    // Update is called once per frame
    void Update()
    {
        SwapGun();
        Movement_V2(); 
    }

    private void FixedUpdate()
    {
        
    }


    //NEW



    void Movement_V2()
    {

        Vector2 input;

        input.x = Input.GetAxis("Horizontal");
        input.y = Input.GetAxis("Vertical");

        anim.SetFloat("PosX", input.x);
        anim.SetFloat("PosY", input.y);
        anim.SetFloat("Mag", input.magnitude);

    }



    public void Aimming_V2()
    {
        if (!MyGun.canShot)
        {
            MyGun.muzzle.Stop();
        }
        if (Input.GetMouseButtonUp(0))
        {
            MyGun.muzzle.Stop();
        }


        if (Input.GetMouseButton(0) && isAiming)
        {
            if (MyGun.canShot && MyGun.readyToUse)
            {

                MyGun.GunShotHandle();
                MyGun.curAmmo--;
            }
        }
        MyGun.UpdateGravityBullets(Time.deltaTime);




    }





    void SwapGun()
    {

        if (Input.GetKeyDown(KeyCode.Alpha1))
        {


            MyGun = firstGun;
            firstGun.gameObject.SetActive(true);
            secondGun.isReaload = false;
            secondGun.gameObject.SetActive(false);
            UIManager.instance.myGun = MyGun;
            UIManager.instance.ActiveGun(1);
            rigController.Play("Rifle");
        }

        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            MyGun = secondGun;
            secondGun.gameObject.SetActive(true);
            firstGun.isReaload = false;
            firstGun.gameObject.SetActive(false);
            UIManager.instance.myGun = MyGun;
            UIManager.instance.ActiveGun(2);
            rigController.Play(MyGun.type.ToString());

        }
    }

  




    //Hàm này lưu lại mọi hoạt động "POSE" của player vào 1 audioClip . Đó cũng chính là mục đích của GameObjectRecoder
    [ContextMenu("Save weapon pose")]
    void SaveweaponPose()
    {
        GameObjectRecorder recoder = new GameObjectRecorder(gameObject);
        recoder.BindComponentsOfType<Transform>(WeaponParent.gameObject, false);
        recoder.BindComponentsOfType<Transform>(WeaponLeftIK.gameObject, false);
        recoder.BindComponentsOfType<Transform>(WeaponRightIK.gameObject, false);
        recoder.TakeSnapshot(0.0f);
        recoder.SaveToClip(MyGun.weaponAnimation);
        UnityEditor.AssetDatabase.SaveAssets();

    }














    //OLD




    // void Aimming()
    // {

    //     if (!MyGun.canShot)
    //     {
    //         MyGun.muzzle.Stop();
    //     }

    //     if (Input.GetMouseButton(0) && isGround == true)
    //     {


    //         Ray camRay = Camera.main.ScreenPointToRay(Input.mousePosition);
    //         Vector3 endPosition = Vector3.zero;
    //         isAiming = true;
    //         int layerBit = LayerMask.GetMask("GroundLayer") | LayerMask.GetMask("EnemyLayer");
    //         int layerBitEnemy = LayerMask.GetMask("GroundLayer") | LayerMask.GetMask("EnemyLayer") | LayerMask.GetMask("BuildingLayer");
    //         // | LayerMask.GetMask("BuildingLayer")
    //         if (Physics.Raycast(camRay, out hit, 100f, layerBit))
    //         {
    //             endPosition = hit.point;
    //             //set rotate
    //             rotateDir = endPosition - MyGun.transform.position;
    //             rotateDir.y = 0;
    //             rot = Quaternion.LookRotation(rotateDir);



    //             if (MyGun.canShot && MyGun.readyToUse)
    //             {

    //                 //Pricle play
    //                 MyGun.muzzle.Play();

    //                 if (MyGun.type == Gun.typeGun.Shotgun)
    //                 {
    //                     for (int i = 0; i < 6; i++)
    //                     {
    //                         //Find the enemy
    //                         Ray ShotRay = new Ray(transform.position, (hit.point - transform.position));
    //                         RaycastHit enemyHit;
    //                         ShotRay.direction = Quaternion.AngleAxis(Random.Range(0, 30), Vector3.up) * ShotRay.direction;
    //                         //Pook object the bullet
    //                         //MyGun.InstanitateMuzzle(ShotRay, rot);
    //                         if (Physics.Raycast(ShotRay, out enemyHit, 100f, layerBitEnemy))
    //                         {

    //                             if (1 << enemyHit.transform.gameObject.layer == LayerMask.GetMask("EnemyLayer"))
    //                             {
    //                                 GameObject blood = Instantiate(MyGun.blood, enemyHit.point, Quaternion.LookRotation(enemyHit.normal));
    //                                 enemyHit.transform.gameObject.GetComponent<Enemy>().heath -= MyGun.damage;
    //                                 Destroy(blood, 1f);
    //                             }
    //                             MyGun.ResetTimeBullet();  //gun delay start
    //                         }
    //                     }
    //                     MyGun.ResetTimeBullet();  //gun delay start

    //                     MyGun.curAmmo--;

    //                 }
    //                 else
    //                 {
    //                     //Find the enemy
    //                     Ray ShotRay = new Ray(transform.position, (hit.point - transform.position));
    //                     RaycastHit enemyHit;


    //                     //Pook object the bullet
    //                     //MyGun.InstanitateMuzzle(ShotRay, rot);
    //                     MyGun.curAmmo--;

    //                     if (Physics.Raycast(ShotRay, out enemyHit, 100f, layerBitEnemy))
    //                     {

    //                         if (1 << enemyHit.transform.gameObject.layer == LayerMask.GetMask("EnemyLayer"))
    //                         {
    //                             GameObject blood = Instantiate(MyGun.blood, enemyHit.point, Quaternion.LookRotation(enemyHit.normal));
    //                             enemyHit.transform.gameObject.GetComponent<Enemy>().heath -= MyGun.damage;
    //                             Destroy(blood, 1f);
    //                         }
    //                         MyGun.ResetTimeBullet();  //gun delay start
    //                     }
    //                 }



    //             }





    //             // Do something with the object that was hit by the raycast.
    //         }
    //     }

    //     if (Input.GetMouseButtonUp(0))
    //     {
    //         MyGun.muzzle.Stop();
    //         isAiming = false;
    //     }
    // }


    // void AddForceToMove(Vector3 moveDirection)
    // {


    //     rid.velocity = new Vector3((moveSpeed * moveDirection.normalized).x, rid.velocity.y, (moveSpeed * moveDirection.normalized).z);
    // }

    // void Movement()
    // {

    //     float h = Input.GetAxis("Horizontal");
    //     // float v = Input.GetAxis("Vertical");
    //     // moveDir.x = h;
    //     // moveDir.z = v;

    //     moveDir = Camera.main.transform.forward;
    //     moveDir.y = 0;
    //     //walk handle
    //     if (!isAiming)
    //     {
    //         if (Input.GetKey(KeyCode.W))
    //         {
    //             anim.SetInteger("Speed", 1);
    //             AddForceToMove(moveDir);
    //         }
    //         if (Input.GetKey(KeyCode.A))
    //         {
    //             Vector3 normal = new Vector3(moveDir.z, moveDir.y, moveDir.x);
    //             normal.x *= -1;
    //             anim.Play("LeftWalk");
    //             if (Input.GetKey(KeyCode.W))
    //             {
    //                 moveDir += normal;
    //                 AddForceToMove(moveDir);
    //             }
    //             else
    //             {
    //                 AddForceToMove(normal);
    //             }
    //             anim.SetBool("LeftWalk", true);
    //         }
    //         // else if (Input.GetKey(KeyCode.S))
    //         // {

    //         // }
    //         // else
    //         // {
    //         //     if (isGround)
    //         //         rid.velocity = new Vector3(0, rid.velocity.y, 0);
    //         //     anim.SetInteger("Speed", 0);
    //         // }
    //     }


    //     //Run handle
    //     if (Input.GetKey(KeyCode.LeftShift) && anim.GetInteger("Speed") == 1)
    //     {
    //         moveSpeed = 4.5f;
    //         anim.SetInteger("Speed", 2);

    //     }
    //     if (Input.GetKeyUp(KeyCode.LeftShift))
    //     {
    //         moveSpeed = 2f;
    //         anim.SetInteger("Speed", 1);
    //     }




    //     Vector3 PointToHit = hit.point - transform.position;
    //     Vector3 direcMoveBackward = -PointToHit;
    //     if (Input.GetKey(KeyCode.S) && isAiming)
    //     {
    //         anim.SetBool("AimWalkBackward", true);
    //         AddForceToMove(direcMoveBackward);
    //         moveSpeed = 2f;
    //     }
    //     else
    //     {
    //         anim.SetBool("AimWalkBackward", false);
    //     }




    //     //transform.rotation = rot;
    // }


    void Jumping()
    {
        anim.SetBool("IsGround", isGround);
        if (isGround && !isAiming)
        {
            if (Input.GetKeyDown(KeyCode.Space))
            {
                isGround = false;
                rid.velocity = new Vector3((jumpForce * moveDir).x, jumpForce, (jumpForce * moveDir).z);
            }
        }
    }

    private void OnCollisionEnter(Collision other)
    {
        if (other.gameObject.tag == "Ground" || other.gameObject.tag == "Building" || other.gameObject.tag == "Veh")
        {
            isGround = true;
        }
    }






}



