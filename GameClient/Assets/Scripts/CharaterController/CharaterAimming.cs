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

    private void Awake()
    {
        controller = GetComponent<MyPlayerController>();
    }
    void Start()
    {
        mainCamera = Camera.main;
        Cursor.visible = false;
        Cursor.lockState = CursorLockMode.Locked;
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
        float YamCam = mainCamera.transform.rotation.eulerAngles.y;
        transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.Euler(0, YamCam, 0), turnSpeed * Time.fixedDeltaTime);
    }






    void Aimming_RayCast()
    {
        controller.Aimming_V2();
    }
}
