using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Animations.Rigging;
public class CharaterAimming : MonoBehaviour
{
    // Start is called before the first frame update
    public float turnSpeed = 50f;
    float aimDuration = 0.3f;
    Camera mainCamera;
    public Rig aimlayer;
    public MyPlayerController controller;
    public Cinemachine.AxisState XAxis;
    public Cinemachine.AxisState YAxis;
    public Transform cameraLookAt;

    private void Awake()
    {
        controller = GetComponent<MyPlayerController>();
    }
    void Start()
    {
        mainCamera = Camera.main;
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
        aimlayer.weight = 1f;
        controller.isAiming = true;

    }

    // Update is called once per frame
    void Update()
    {
        Aimming_RayCast();
    }

    private void FixedUpdate()
    {
        //Quay nguoi theo camera
        float YamCam = mainCamera.transform.rotation.eulerAngles.y;
        transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.Euler(0, YamCam, 0), turnSpeed * Time.fixedDeltaTime);

        XAxis.Update(Time.fixedDeltaTime);
        YAxis.Update(Time.fixedDeltaTime);
        cameraLookAt.eulerAngles = new Vector3(YAxis.Value , XAxis.Value , 0);

        
    }


    void Aimming_RayCast()
    {
        controller.Aimming_V2();
    }
}
