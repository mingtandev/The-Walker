using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;
public class ChangeColorMaterial : MonoBehaviour
{

    public GameObject ammo;
    void Start()
    {
        ammo.transform.DORotate(new Vector3(0f, 360f, 0f), 1f).SetEase(Ease.Linear).SetLoops(-1 , LoopType.Incremental);
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
