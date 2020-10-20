using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class NormalZombie : Enemy
{
    // Start is called before the first frame update



    //STATE PARTTERN
    public AttackState attack = new AttackState();
    public ChaseState chase = new ChaseState();
    public IdleState idle = new IdleState();
    public WanderState wander = new WanderState();
    public IEnemyState currentState;




    public TypeOfZombie ZombieType;

    public Animator anim;
    private MyPlayerController playerController;
    private float timeWalking = 0;
    private float timeChangeDirec = 4f;
    [HideInInspector]
    public bool changeDirec = true;


    protected string Couroutine_PathFiding = "PathFinding";
    //private Status WalkerStatus = Status.Idle;
    public float DistanceToChase = 10f;

    AudioSource audioSource;
    protected void Awake()
    {
        anim = GetComponent<Animator>();
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>();
        playerController = GameObject.FindGameObjectWithTag("Player").GetComponent<MyPlayerController>();
        currentState = idle;
        damage = 10;
        audioSource = GetComponent<AudioSource>();
    }

    void Start()
    {
        StartCoroutine(Couroutine_PathFiding);
    }

    // Update is called once per frame
    void Update()
    {
        Action();
    }

    private void LateUpdate()
    {
        Attack();
    }

    protected void Action()
    {
        if (!isDeath)
        {
            if (heath <= 0)
            {
                StartCoroutine(DieAction());
            }

            HearShootSound();
            if (ZombieType == TypeOfZombie.Walker)
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
        if (playerController.isAiming)
        {
            if (ZombieType != TypeOfZombie.Walker)
                DistanceToChase = 30f;
            else
                DistanceToChase = 20f;
        }
        else
        {
            if (ZombieType != TypeOfZombie.Walker)
                DistanceToChase = 20f;
            else
                DistanceToChase = 10f;
        }
    }

    void StillAttackRange()   //this function add to key event
    {
        base.AttackInRange();
    }

    IEnumerator DieAction()
    {
        anim.Play("Die");
        isDeath = true;
        AudioClip clipDie;
        if (isFemale)
        {
            clipDie = Resources.Load("Audio/Female_Dead") as AudioClip;
        }
        else
        {
            clipDie = Resources.Load("Audio/Male_Dead") as AudioClip;
        }
        audioSource.PlayOneShot(clipDie,1f);
        
        StopCoroutine(Couroutine_PathFiding);
        GetComponent<NavMeshAgent>().enabled = false;  //stop path finding
        yield return new WaitForSeconds(1.8f);
        audioSource.Stop();
        this.enabled = false;
        GetComponent<CapsuleCollider>().enabled = false;
        GetComponent<Rigidbody>().constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionY;
        Destroy(gameObject , 2f);
    }

    void StopAction()
    {
        currentState = idle;
    }


    void ChangeDirecWalk()
    {
        if (timeWalking <= timeChangeDirec)
        {
            timeWalking += Time.deltaTime;
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

        if (!player.IsDeath)
        {
            int number = Random.Range(50, 100);
            float time = 1f / number;
            float delayTime = 0;
            float realtime = 0;


            currentState = currentState.DoState(this, player, ref delayTime);


            if (delayTime + time > 1.2)
                realtime = (delayTime + time) / 2f;


            yield return new WaitForSeconds(realtime);


            StartCoroutine(Couroutine_PathFiding);

        }
        else
        {
            anim.SetBool("Attack", false);
            anim.SetBool("Chasing", false);
        }
    }

}
