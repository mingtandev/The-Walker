using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraFollow : MonoBehaviour
{
    // Start is called before the first frame update
    public GameObject target;
    
    public float speed = 100f;
    Animator anim;
    public int isAimming;
    private void Awake()
    {
        anim = GameObject.FindGameObjectWithTag("Player").GetComponent<Animator>();

    }
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        Vector3 targetPos = Vector3.Lerp(transform.position,target.transform.position , speed*Time.deltaTime);
        transform.position = targetPos;
        

    }



}
