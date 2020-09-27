using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraFollow : MonoBehaviour
{
    // Start is called before the first frame update
    MyPlayerController player;
    Camera cam;
    int distance = 20;

    private void Awake() {
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<MyPlayerController>();
        cam = Camera.main;

    }
    void Start()
    {
        cam.transform.position = new Vector3(player.transform.position.x , cam.transform.position.y , player.transform.position.z+distance);

    }

    // Update is called once per frame
    void Update()
    {
        cam.transform.position = new Vector3(player.transform.position.x , cam.transform.position.y , player.transform.position.z+distance);
    }



}
