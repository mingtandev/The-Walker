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



    //STATE PARTTERN
    public AttackState attack = new AttackState();
    public ChaseState chase = new ChaseState();
    public IdleState idle = new IdleState();
    public WanderState wander = new WanderState();


    public IEnemyState currentState;

    public int heath;
    public GameObject attackPoint;
    public NavMeshAgent agent;
    bool isDeath;
    [SerializeField]
    TypeOfZombie ZombieType;

    public Animator anim;
    public Player player;
    private MyPlayerController playerController;
    private float timeWalking = 0;
    private float timeChangeDirec = 4f;
    [HideInInspector]
    public bool changeDirec = true;



    string Couroutine_PathFiding = "PathFinding";
    //private Status WalkerStatus = Status.Idle;
    public float DistanceToChase = 10f;


    private void Awake()
    {
        anim = GetComponent<Animator>();
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>();
        playerController = GameObject.FindGameObjectWithTag("Player").GetComponent<MyPlayerController>();

        currentState = idle;
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
            HearShootSound();
            ChangeDirecWalk();
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
                currentState = attack;
            }
        }
        else
        {
            anim.SetBool("Attack", false);
        }
    }

    void HearShootSound()
    {
        if(playerController.isAiming)
        {
            DistanceToChase = 20f;
        }
        else
        {
            DistanceToChase = 10f;
        }
    }

    void StillAttackRange()   //this function add to key event
    {
        Collider[] obj = Physics.OverlapSphere(attackPoint.transform.position, 1f, LayerMask.GetMask("PlayerLayer"));
        if (obj.Length > 0)
        {
            if (obj[0].tag == "Player")
            {
                player.Heal -= 10;
                Debug.Log(player.Heal);
            }
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

    void StopAction()
    {
        currentState = idle;
    }


    void ChangeDirecWalk()
    {
        if(timeWalking<=timeChangeDirec)
        {
            timeWalking+=Time.deltaTime;
        }
        else
        {
            timeWalking = 0;
            changeDirec = true;
            //currentState = idle;
        }
    }
    IEnumerator PathFinding()
    {

        if(!player.IsDeath)
        {
            
            currentState = currentState.DoState(this , player);
            yield return new WaitForSeconds(1f);
            StartCoroutine(Couroutine_PathFiding);
        }
        else
        {
            anim.SetBool("Attack", false);
            anim.SetBool("Chasing", false);
        }
    }




}
