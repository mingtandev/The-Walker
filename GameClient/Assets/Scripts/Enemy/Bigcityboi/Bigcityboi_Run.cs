using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bigcityboi_Run : StateMachineBehaviour
{

    Transform trans;
    Bigcityboi boss;
    public static int stepAttack = 0;
    // OnStateEnter is called when a transition starts and the state machine starts to evaluate this state
    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        trans = animator.GetComponent<Transform>();
        boss = animator.GetComponent<Bigcityboi>();
        animator.ResetTrigger("StartBossFight");
    }

    // OnStateUpdate is called on each Update frame between OnStateEnter and OnStateExit callbacks
    override public void OnStateUpdate(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {


        if (CheckAttackRange(animator))
        {
            return;
        }

        boss.agent.SetDestination(boss.player.transform.position);


    }

    // OnStateExit is called when a transition ends and the state machine finishes evaluating this state
    override public void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        
    }

    bool CheckAttackRange(Animator animator)
    {
        Collider[] obj = Physics.OverlapSphere(boss.attackPoint.transform.position, 1f, LayerMask.GetMask("PlayerLayer"));
        if (obj.Length > 0)
        {
            if (obj[0].tag == "Player")
            {
                animator.SetBool("Attack" + stepAttack.ToString(), true);
                return true;
            }
        }

        return false;
    }

    


}
