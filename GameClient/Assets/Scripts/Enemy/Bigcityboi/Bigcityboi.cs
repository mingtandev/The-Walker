using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
public class Bigcityboi : Enemy
{
    // Start is called before the first frame update
    Animator anim;



    private void Awake()
    {
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>();
        agent = GetComponent<NavMeshAgent>();
        anim = GetComponent<Animator>();
        damage = 30;
    }

    private void Start()
    {

    }


    private void Update()
    {
        Die();
    }

    public void TheAttackEnd()
    {
        anim.SetBool("Attack" + Bigcityboi_Run.stepAttack.ToString(), false);

    }




    void Die()
    {
        if (!isDeath)
        {
            if (heath <= 0)
            {
                StartCoroutine(DieAction());
            }
        }
    }
    public void StopWhenPlayerDie()
    {
        if (player.Heal <= 0)
        {
            anim.Play("Idle");
        }
    }



    IEnumerator DieAction()
    {
        anim.Play("Die");
        isDeath = true;

        yield return new WaitForSeconds(1f);

        this.enabled = false;
        GetComponent<CapsuleCollider>().enabled = false;
        GetComponent<Rigidbody>().constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionY;

    }



}
