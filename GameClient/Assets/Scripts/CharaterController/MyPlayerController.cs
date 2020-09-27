using System.Collections;
using System.Collections.Generic;
using UnityEngine;
// using SimpleJSON;
using UnityEngine.Networking;

public class MyPlayerController : MonoBehaviour
{
    // Start is called before the first frame update
    CharacterController controller;
    Animator anim;
    Rigidbody rid;
    

    //Shoot
    bool isAiming = false;
    Gun MyGun;

    



    //Movement field
    Vector3 moveDir;
    Vector3 rotateDir; //same above but y = 0 (not moving to sky)
    float moveSpeed = 1.5f;  // run is 4.5
    Quaternion rot;
    float rotVel = 80f;


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
        MyGun = GameObject.FindGameObjectWithTag("Gun").GetComponent<Gun>();
    }

    // Update is called once per frame
    void Update()
    {
        Aimming();
    }

    private void FixedUpdate()
    {
        Movement();
        Jumping();

    }

    void Aimming()
    {

        if(!MyGun.canShot)
        {
            MyGun.muzzle.Stop();
        }
        
        if (Input.GetMouseButton(0) && isGround == true)
        {
            
            RaycastHit hit;
            Ray camRay = Camera.main.ScreenPointToRay(Input.mousePosition);

            Vector3 endPosition = Vector3.zero;
            isAiming = true;
            int layerBit = LayerMask.GetMask("GroundLayer") | LayerMask.GetMask("EnemyLayer");
            if (Physics.Raycast(camRay, out hit , 50f , layerBit))
            {   

                        endPosition = hit.point;
                        //set rotate
                        rotateDir = endPosition - transform.position;
                        rotateDir.y=0;
                        rot = Quaternion.LookRotation(rotateDir);

                       
                       if(MyGun.canShot)
                       {
                            MyGun.muzzle.Play();
                            //HANDLE Damage 
                        if(1 << hit.transform.gameObject.layer == LayerMask.GetMask("EnemyLayer"))
                        {
                            GameObject blood = Instantiate(MyGun.blood , hit.point , Quaternion.LookRotation(hit.normal));
                            hit.transform.gameObject.GetComponent<Enemy>().heath-=MyGun.damage;
                            Destroy(blood,1f);
                        }
                            MyGun.ResetTimeBullet();
                       }
                        


                // Do something with the object that was hit by the raycast.
            }
        }

        if(Input.GetMouseButtonUp(0))
        {
            MyGun.muzzle.Stop();
            isAiming = false;
        }

        anim.SetBool("Aimming" , isAiming);
    }

    void Movement()
    {

    
        //walk handle
        if ((Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.D)) && !isAiming)
        {
            float h = Input.GetAxis("Horizontal");
            float v = Input.GetAxis("Vertical");

            moveDir.x = h;
            moveDir.z = v;

            rotateDir = moveDir;
            rotateDir.y = 0;
            rid.velocity = new Vector3((moveSpeed * moveDir.normalized).x, rid.velocity.y, (moveSpeed * moveDir.normalized).z);
            rot = Quaternion.LookRotation(rotateDir);
            anim.SetInteger("Speed", 1);
        }
        else
        {
            if (isGround)
                rid.velocity = new Vector3(0, rid.velocity.y, 0);
            anim.SetInteger("Speed", 0);
        }

        //Run handle
        if(Input.GetKey(KeyCode.LeftShift) && anim.GetInteger("Speed")==1)
        {
            moveSpeed = 4.5f;
            anim.SetInteger("Speed", 2);

        }
        
        if(Input.GetKeyUp(KeyCode.LeftShift))
        {
            moveSpeed = 2f;
            anim.SetInteger("Speed", 1);
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




}
