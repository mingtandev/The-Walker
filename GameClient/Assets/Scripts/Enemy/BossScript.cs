using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BossScript : NormalZombie
{
   
    private Transform rootTransfom;
    
    public new void Awake()
    {
        base.Awake();
        base.damage = 50;
    }

    private void Update()
    {
        base.Action();


    }


    void Start()
    {
        base.StartCoroutine(Couroutine_PathFiding);
    }



}
