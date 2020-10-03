using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bigcityboi_Attack : StateMachineBehaviour
{
    Bigcityboi boss;
    int curstep;
    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        boss = animator.GetComponent<Bigcityboi>();
        curstep = Bigcityboi_Run.stepAttack;
    }

    override public void OnStateUpdate(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        CheckAttackRange(animator);
        CheckStillRange(animator);

    }

    override public void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        animator.SetBool("Attack" + (curstep).ToString(), false);

    }


    bool CheckAttackRange(Animator animator)
    {
        Collider[] obj = Physics.OverlapSphere(boss.attackPoint.transform.position, 1f, LayerMask.GetMask("PlayerLayer"));
        if (obj.Length > 0)
        {
            if (obj[0].tag == "Player")
            {

                // check if not angry
                animator.SetBool("Attack" + Bigcityboi_Run.stepAttack.ToString(), true);
                //else


                if (Bigcityboi_Run.stepAttack == curstep)
                {
                    Bigcityboi_Run.stepAttack++;
                    Bigcityboi_Run.stepAttack %= 3;
                }
                return true;
            }
        }

        return false;
    }

    void CheckStillRange(Animator animator)
    {
        Collider[] obj = Physics.OverlapSphere(boss.attackPoint.transform.position, 1f, LayerMask.GetMask("PlayerLayer"));
        if (obj.Length <= 0)
        {

            animator.SetBool("Attack0".ToString(), false);
            animator.SetBool("Attack1".ToString(), false);
            animator.SetBool("Attack2".ToString(), false);

        }

    }


}
