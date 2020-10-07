using System.Collections;
using System.Collections.Generic;
using UnityEngine;
// using SimpleJSON;
using UnityEngine.Networking;

public class MyPlayerController : MonoBehaviour
{
    // Start is called before the first frame update
    Animator anim;
    Rigidbody rid;


    //Shoot
    public bool isAiming = false;
    public Gun MyGun; //The current gun

    Gun firstGun;
    Gun secondGun;

    RaycastHit hit;



    //Movement field
    Vector3 moveDir;
    Vector3 rotateDir; //same above but y = 0 (not moving to sky)
    float moveSpeed = 1.5f;  // run is 4.5
    Quaternion rot;


    //Jump
    bool isGround = true;
    float jumpForce = 4f;
    LayerMask ground;

    private void Awake()
    {
        ground = LayerMask.GetMask("GroundLayer");
        rid = GetComponent<Rigidbody>();
        anim = GetComponent<Animator>();
        moveDir = Vector3.forward;
    }

    void Start()
    {
        firstGun = SaveLoadManager.chooseGun[0].gun.GetComponent<Gun>();
        secondGun = SaveLoadManager.chooseGun[1].gun.GetComponent<Gun>();
        secondGun.gameObject.SetActive(false);
        MyGun = firstGun;

        Debug.Log(firstGun.nameGun);
        Debug.Log(secondGun.nameGun);
    }

    // Update is called once per frame
    void Update()
    {
        Aimming();
        SwapGun();
    }

    private void FixedUpdate()
    {
        Movement();
        Jumping();

    }

    void Aimming()
    {

        if (!MyGun.canShot)
        {
            MyGun.muzzle.Stop();
        }

        if (Input.GetMouseButton(0) && isGround == true)
        {


            Ray camRay = Camera.main.ScreenPointToRay(Input.mousePosition);
            Vector3 endPosition = Vector3.zero;
            isAiming = true;
            int layerBit = LayerMask.GetMask("GroundLayer") | LayerMask.GetMask("EnemyLayer") | LayerMask.GetMask("BuildingLayer");
            if (Physics.Raycast(camRay, out hit, 100f, layerBit))
            {
                endPosition = hit.point;
                //set rotate
                rotateDir = endPosition - MyGun.transform.position;
                rotateDir.y = 0;
                rot = Quaternion.LookRotation(rotateDir);


                if (MyGun.canShot && MyGun.readyToUse)
                {

                    //Find the enemy
                    Ray ShotRay = new Ray(transform.position, (hit.point - transform.position));
                    RaycastHit enemyHit;


                    //Pricle play
                    MyGun.muzzle.Play();

                    //Pook object the bullet
                    MyGun.InstanitateMuzzle(ShotRay, rot);
                    MyGun.curAmmo--;
                    Debug.DrawRay(ShotRay.origin, ShotRay.direction * 50f, Color.red);
                    if (Physics.Raycast(ShotRay, out enemyHit, 100f, layerBit))
                    {

                        if (1 << enemyHit.transform.gameObject.layer == LayerMask.GetMask("EnemyLayer"))
                        {
                            GameObject blood = Instantiate(MyGun.blood, enemyHit.point, Quaternion.LookRotation(enemyHit.normal));
                            enemyHit.transform.gameObject.GetComponent<Enemy>().heath -= MyGun.damage;
                            Destroy(blood, 1f);
                        }
                        MyGun.ResetTimeBullet();  //gun delay start
                    }

                }





                // Do something with the object that was hit by the raycast.
            }
        }

        if (Input.GetMouseButtonUp(0))
        {
            MyGun.muzzle.Stop();
            isAiming = false;
        }

        anim.SetBool("Aimming", isAiming);
    }


    void AddForceToMove(Vector3 moveDirection)
    {


        rid.velocity = new Vector3((moveSpeed * moveDirection.normalized).x, rid.velocity.y, (moveSpeed * moveDirection.normalized).z);
    }

    void Movement()
    {

        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");
        moveDir.x = h;
        moveDir.z = v;


        //walk handle
        if ((Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.D)) && !isAiming)
        {
            anim.SetInteger("Speed", 1);
            AddForceToMove(moveDir);
            rotateDir = moveDir;
            rotateDir.y = 0;
            rot = Quaternion.LookRotation(rotateDir);


        }
        else
        {
            if (isGround)
                rid.velocity = new Vector3(0, rid.velocity.y, 0);
            anim.SetInteger("Speed", 0);
        }

        //Run handle
        if (Input.GetKey(KeyCode.LeftShift) && anim.GetInteger("Speed") == 1)
        {
            moveSpeed = 4.5f;
            anim.SetInteger("Speed", 2);

        }
        if (Input.GetKeyUp(KeyCode.LeftShift))
        {
            moveSpeed = 2f;
            anim.SetInteger("Speed", 1);
        }




        Vector3 PointToHit = hit.point - transform.position;
        Vector3 direcMoveBackward = -PointToHit;
        if (Input.GetKey(KeyCode.S) && isAiming)
        {
            anim.SetBool("AimWalkBackward", true);
            AddForceToMove(direcMoveBackward);
            moveSpeed = 2f;
        }
        else
        {
            anim.SetBool("AimWalkBackward", false);
        }




        transform.rotation = rot;
    }


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


    void SwapGun()
    {

        if (Input.GetKeyDown(KeyCode.Alpha1))
        {

            MyGun = firstGun;
            secondGun.gameObject.SetActive(false);
            firstGun.gameObject.SetActive(true);
            UIManager.instance.myGun = MyGun;
            UIManager.instance.ActiveGun(1);

        }

        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            MyGun = secondGun;
            secondGun.gameObject.SetActive(true);
            firstGun.gameObject.SetActive(false);
            UIManager.instance.myGun = MyGun;
            UIManager.instance.ActiveGun(2);
        }
    }

}
