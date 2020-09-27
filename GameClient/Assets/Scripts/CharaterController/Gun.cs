using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Gun : MonoBehaviour
{
    // Start is called before the first frame update

    public ParticleSystem muzzle;
    public GameObject blood;


    
    float currenTime = 0f;
    public float timeDelay;
    public int damage;

    [HideInInspector]
    public bool canShot;
    private void Awake() {
        muzzle.Stop();
        
    }

    void Start()
    {
        currenTime = timeDelay;
    }

    // Update is called once per frame
    void Update()
    {
        currenTime+=Time.deltaTime;
        if(currenTime>timeDelay)
        {
            canShot = true;
            currenTime = timeDelay;
        }
    }

    public void ResetTimeBullet()
    {
        currenTime = 0;
        canShot = false;
    }


}
