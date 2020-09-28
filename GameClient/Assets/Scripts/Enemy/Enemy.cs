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
        Chase
    }

    public int heath;
    public NavMeshAgent agent;
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
        if (heath <= 0)
        {
            StartCoroutine(UnActive());
            anim.Play("Die");

        }
    }

    IEnumerator UnActive()
    {
        Die();
        yield return new WaitForSeconds(2f);
        this.enabled = false;
        GetComponent<CapsuleCollider>().enabled = false;
        GetComponent<Rigidbody>().constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionY;
    }

    void Die()
    {
        StopCoroutine(Couroutine_PathFiding);
        GetComponent<NavMeshAgent>().enabled = false;
    }

    IEnumerator PathFinding()
    {
        agent.SetDestination(transform.position);
        float dis = Vector3.Distance(transform.position, player.transform.position);
        switch (WalkerStatus)
        {
            case Status.Idle:
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
        }

        yield return new WaitForSeconds(0.5f);
        StartCoroutine(Couroutine_PathFiding);
    }
}
