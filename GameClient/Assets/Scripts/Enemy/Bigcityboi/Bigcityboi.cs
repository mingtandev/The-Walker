using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
public class Bigcityboi : Enemy
{
    // Start is called before the first frame update
    Animator anim;
    bool isAttack;
    AudioSource audioSrc;
    private void Awake()
    {
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>();
        agent = GetComponent<NavMeshAgent>();
        anim = GetComponent<Animator>();
        audioSrc = GetComponent<AudioSource>();
        damage = 30;
    }

    private void Start()
    {
        
    }


    private void Update()
    {
        Die();
        CheckToAttack();
        
    }

    public void TheAttackEnd()
    {
        anim.SetBool("Attack" + Bigcityboi_Run.stepAttack.ToString(), false);

    }


    void CheckToAttack()
    {
        if(!isAttack)
        {
            if(Vector3.Distance(player.transform.position , gameObject.transform.position) <= 30)
            {
                anim.SetTrigger("StartBossFight");
                isAttack=true;
                audioSrc.Stop();
            }
        }
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
        UIManager.Instance.BigboiKill.text = "Kill Bigboi 1/1";
        GameManager.Instance.SetCoin(10000);
        UIManager.Instance.MissionCompleteShow();
        yield return new WaitForSeconds(1f);

        this.enabled = false;
        GetComponent<CapsuleCollider>().enabled = false;
        GetComponent<Rigidbody>().constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionY;

        yield return new WaitForSeconds(4f);

        StartCoroutine(GameManager.Instance.LoadAsyncChronous(0 , UIManager.Instance.LoadingScene));

    }


    //SOUND MANAGER
    void Crawl()
    {
        SoundManager.instance.Stop("Bigcityboi_Breath");
        SoundManager.instance.Play("Bigcityboi_Crawl");
    }

    void Attack()
    {
        SoundManager.instance.Play("Bigcityboi_Attack");
    }

    void Attack1()
    {
        SoundManager.instance.Play("Bigcityboi_Attack1");

    }
    void Attack2()
    {
        SoundManager.instance.Play("Bigcityboi_Attack2");

    }

    void DeadSound()
    {
        SoundManager.instance.Play("Bigcityboi_Dead");
    }

    void Footstep()
    {
        SoundManager.instance.Play("Bigcityboi_Footstep");
    }
}
