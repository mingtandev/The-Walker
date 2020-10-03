using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    // field
    private int heal;
    private bool isDeath;
    Animator anim;
    public int Heal
    {
        get
        {
            return heal;
        }
        set
        {
            heal = value;
        }
    }
    public bool IsDeath
    {
        get
        {
            return isDeath;
        }
    }



    private void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Start()
    {
        heal = 100;
    }

    private void Update()
    {
        Die();
    }

    void Die()
    {
        if (Heal <= 0)
        {
            isDeath = true;
            anim.Play("Die");
            GetComponent<MyPlayerController>().enabled=false;

        }
    }

}
