using System.Collections;
using System.Collections.Generic;
using UnityEngine;
// using SimpleJSON;
using UnityEngine.Networking;
using Cinemachine;

public class MyPlayerController : MonoBehaviour
{
    // Start is called before the first frame update
    Animator anim;
    public Animator rigController;
    Rigidbody rid;
    Camera cameraMain;

    [HideInInspector]
    public Cinemachine.CinemachineImpulseSource camShake;


    //Shoot
    [HideInInspector]
    public bool isAiming = true;
    [HideInInspector]
    public Gun MyGun; //The current gun

    Gun firstGun;
    Gun secondGun;
    int activeIndexGun = 1;
    bool isGunActive = true;
    public Transform CrossHairTarget;
    bool changingWeapon;



    //Movement field
    Vector3 moveDir;
    Vector3 rotateDir; //same above but y = 0 (not moving to sky)
    float moveSpeed = 1.5f;  // run is 4.5
    Quaternion rot;
    GameObject target;
    int hashSprint = Animator.StringToHash("Run");

    //Jump
    bool isGround = true;
    float jumpForce = 3f;
    LayerMask ground;

    //SAVE THE IK TO AUDIOCLIP
    public Transform WeaponParent;
    public Transform WeaponLeftIK;
    public Transform WeaponRightIK;
    public Transform WeasponSlot;
    public Transform WeaponHandle;
    public Cinemachine.CinemachineFreeLook playerCamera;


    public static MyPlayerController instance;

    //--------------------------------------------------------------------------------------------------------------------------------------------
    //NEW



    private void Awake()
    {
        MakeSigleton();
        cameraMain = Camera.main;
        //  Cursor.visible = false;
        ground = LayerMask.GetMask("GroundLayer");
        rid = GetComponent<Rigidbody>();
        anim = GetComponent<Animator>();

        moveDir = Vector3.forward;
        target = GameObject.FindGameObjectWithTag("TargetFollow");

        camShake = GetComponent<CinemachineImpulseSource>();
    }

    void Start()
    {
        firstGun = GameScene_SaveLoadManager.chooseGun[0].gun.GetComponent<Gun>();
        secondGun = GameScene_SaveLoadManager.chooseGun[1].gun.GetComponent<Gun>();
        secondGun.gameObject.transform.parent = WeasponSlot;
        secondGun.transform.localPosition = Vector3.zero;
        secondGun.transform.localRotation = Quaternion.identity;
        MyGun = firstGun;
        MyGun.transform.localPosition = MyGun.posOfSlotGun;
        rigController.Play(MyGun.type.ToString());

    }

    // Update is called once per frame
    void Update()
    {
        Swap_HideGun();
        Movement_V2();
        bool isAim = Input.GetMouseButton(1);
        anim.SetBool("Aim", isAim);
    }

    private void FixedUpdate()
    {
        MyGun.transform.localPosition = MyGun.posOfSlotGun;
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

        SprintUpdate(input);

    }

    void SprintUpdate(Vector2 input)
    {
        if (input.y <= 0)
        {
            anim.SetBool(hashSprint, false);
            return;
        }

        bool sprint = Input.GetKey(KeyCode.LeftShift);
        anim.SetBool(hashSprint, sprint);

    }



    public void Aimming_V2()
    {
        if (isGunActive)
        {
            if (!MyGun.canShot)
            {
                MyGun.muzzle.Stop();
            }
            if (Input.GetMouseButtonUp(0))
            {
                MyGun.recoil.ResetIndex();
                MyGun.muzzle.Stop();
            }


            if (Input.GetMouseButton(0) && isAiming)
            {
                if (MyGun.canShot && MyGun.readyToUse)
                {

                    MyGun.GunShotHandle();
                    camShake.GenerateImpulse(Camera.main.transform.forward);
                    MyGun.curAmmo--;
                    rigController.Play(MyGun.type.ToString() + "Recoil", 1, 0.0f);
                }
            }
            MyGun.UpdateGravityBullets(Time.deltaTime);
        }






    }




    //-----------------GUN SWAP HANDLE

    IEnumerator ActivePrimaryGun()
    {
        //If previous is second gun
        if (activeIndexGun != 0 && activeIndexGun != 1)
        {
            StartCoroutine(HideAndShowAtGunIndex(activeIndexGun));
            yield return new WaitForSeconds(rigController.GetCurrentAnimatorStateInfo(0).length - 0.05f);
        }
        MyGun = firstGun;
        MyGun.transform.localPosition = MyGun.posOfSlotGun;
        activeIndexGun = 1;

        Reset_Animation();

        firstGun.gameObject.SetActive(true);
        UIManager.instance.myGun = MyGun;
        UIManager.instance.ActiveGun(1);
        rigController.Play(MyGun.type.ToString());

        //UNACTIVE SECOND GUN
        secondGun.isReaload = false;
    }

    IEnumerator ActiveSecondaryGun()
    {

        if (activeIndexGun != 0 && activeIndexGun != 2)
        {
            StartCoroutine(HideAndShowAtGunIndex(activeIndexGun));
            yield return new WaitForSeconds(rigController.GetCurrentAnimatorStateInfo(0).length - 0.05f);

        }

        MyGun = secondGun;
        MyGun.transform.localPosition = MyGun.posOfSlotGun;

        activeIndexGun = 2;

        Reset_Animation();

        secondGun.gameObject.SetActive(true);
        UIManager.instance.myGun = MyGun;
        UIManager.instance.ActiveGun(2);
        rigController.Play(MyGun.type.ToString());

        //UNACTIVE FIRST GUN
        firstGun.isReaload = false;
    }

    IEnumerator HideAndShowAtGunIndex(int index)
    {

        bool curState = rigController.GetBool("HiddenGun");
        curState = !curState;
        rigController.SetBool("HiddenGun", curState);

        activeIndexGun = 0;

        if (!curState)
        {
            yield return null;
            MyGun.gameObject.transform.parent = WeaponHandle;
            EnableGun();
        }
        else
        {
            changingWeapon = true;
            yield return new WaitForSeconds(rigController.GetCurrentAnimatorStateInfo(0).length - 0.05f);
            MyGun.gameObject.transform.parent = WeasponSlot;
            changingWeapon = false;
            DisableGun();
        }

    }

    void Reset_Animation()
    {
        rigController.SetBool("HiddenGun", false);
        EnableGun();
        MyGun.gameObject.transform.parent = WeaponHandle;

    }

    void Swap_HideGun()
    {

        if (!changingWeapon)
        {
            if (Input.GetKeyDown(KeyCode.Alpha1))
            {
                StartCoroutine(ActivePrimaryGun());
                EnableGun();
            }

            if (Input.GetKeyDown(KeyCode.Alpha2))
            {
                StartCoroutine(ActiveSecondaryGun());
                EnableGun();
            }

            // if (Input.GetKeyDown(KeyCode.X) && changingWeapon == false)
            // {
            //     StartCoroutine(HideAndShowAtGunIndex(activeIndexGun));
            // }
        }
    }



    void EnableGun()
    {
        isGunActive = true;
        MyGun.enabled = true;
    }

    void DisableGun()
    {
        isGunActive = false;
        MyGun.enabled = false;
    }



    //Hàm này lưu lại mọi hoạt động "POSE" của player vào 1 audioClip . Đó cũng chính là mục đích của GameObjectRecoder
    // [ContextMenu("Save weapon pose")]
    // void SaveweaponPose()
    // {
    //     GameObjectRecorder recoder = new GameObjectRecorder(gameObject);
    //     recoder.BindComponentsOfType<Transform>(WeaponParent.gameObject, false);
    //     recoder.BindComponentsOfType<Transform>(WeaponLeftIK.gameObject, false);
    //     recoder.BindComponentsOfType<Transform>(WeaponRightIK.gameObject, false);
    //     recoder.TakeSnapshot(0.0f);
    //     recoder.SaveToClip(MyGun.weaponAnimation);
    //     UnityEditor.AssetDatabase.SaveAssets();
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


    void MakeSigleton()
    {
        if (instance == null)
            instance = this;
        else
            Destroy(gameObject);
    }


    private void OnTriggerStay(Collider other)
    {
        if (other.transform.tag == "BuffAmmo")
        {
            UIManager.Instance.ShowGetAmmo();
            if (Input.GetKeyDown(KeyCode.E))
            {
                MyGun.AddTotalAmmo();
            }
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.transform.tag == "BuffAmmo")
        {
            UIManager.Instance.HideGetAmmo();
            
        }
    }

}



