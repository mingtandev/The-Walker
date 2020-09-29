using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class Enemy : MonoBehaviour
{
    // Start is called before the first frame update
    enum TypeOfZombie
    {
        Walker,
        Runners,
    }

    enum Status
    {
        Idle,
        Chase,
        Attack
    }

    public int heath;
    public GameObject attackPoint;
    public NavMeshAgent agent;
    bool isDeath;
    [SerializeField]
    TypeOfZombie ZombieType;

    Animator anim;
    MyPlayerController player;




    string Couroutine_PathFiding = "PathFinding";
    private Status WalkerStatus = Status.Idle;
    private float DistanceToChase = 10f;


    private void Awake()
    {
        anim = GetComponent<Animator>();
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<MyPlayerController>();
    }

    void Start()
    {
        StartCoroutine(Couroutine_PathFiding);
    }

    // Update is called once per frame
    void Update()
    {
        if (!isDeath)
        {
            if (heath <= 0)
            {
                StartCoroutine(DieAction());
            }

            Attack();
        }
    }


    void Attack()
    {
        // Debug.DrawRay(attackPoint.transform.position,-direc.normalized,Color.yellow);
        Collider[] obj = Physics.OverlapSphere(attackPoint.transform.position, 1f, LayerMask.GetMask("PlayerLayer"));
        if (obj.Length > 0)
        {
            if (obj[0].tag == "Player")
            {
                WalkerStatus = Status.Attack;
                anim.SetBool("Attack", true);
            }
        }
        else
        {
            anim.SetBool("Attack", false);
        }
    }

    IEnumerator DieAction()
    {
        anim.Play("Die");
        isDeath = true;

        StopCoroutine(Couroutine_PathFiding);
        GetComponent<NavMeshAgent>().enabled = false;  //stop path finding

        yield return new WaitForSeconds(2f);

        this.enabled = false;
        GetComponent<CapsuleCollider>().enabled = false;
        GetComponent<Rigidbody>().constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionY;

    }

    IEnumerator PathFinding()
    {
        float dis = Vector3.Distance(transform.position, player.transform.position);
        switch (WalkerStatus)
        {
            case Status.Idle:
                agent.SetDestination(transform.position);
                if (dis < DistanceToChase)
                {
                    WalkerStatus = Status.Chase;
                    anim.SetBool("Chasing", true);
                }
                break;
            case Status.Chase:
                agent.SetDestination(player.transform.position);
                if (dis > DistanceToChase)
                {
                    WalkerStatus = Status.Idle;
                    anim.SetBool("Chasing", false);
                }
                break;
            case Status.Attack:
                agent.SetDestination(transform.position);
                if (dis < DistanceToChase)   
                {
                    WalkerStatus = Status.Chase;   //Tai5 enum attack , tức là lúc attack phải set des tại chỗ để tấn công , sau đó set chase vì nhân vật chắc chắc k di chuyen quá xa
                }
                break;
        }

        yield return new WaitForSeconds(0.5f);
        StartCoroutine(Couroutine_PathFiding);
    }
}
