using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : MonoBehaviour
{
    // Start is called before the first frame update
    public int heath;

    


    Animator anim;


    private void Awake() {
        anim = GetComponent<Animator>();
    }

    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if(heath<=0)
        {
            StartCoroutine(UnActive());
            anim.Play("Die");
        }
    }

    IEnumerator UnActive()
    {
        yield return new WaitForSeconds(2f);
        this.enabled = false;
        GetComponent<CapsuleCollider>().enabled = false;

    }
}
