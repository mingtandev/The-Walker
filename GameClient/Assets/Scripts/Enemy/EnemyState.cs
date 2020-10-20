using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public interface IEnemyState
{
    IEnemyState DoState(NormalZombie enemy, Player player , ref float timeDelay);
}

public class AttackState : IEnemyState
{
    public IEnemyState DoState(NormalZombie enemy, Player player , ref float timeDelay)
    {
        
        enemy.agent.isStopped = true;
        float dis = Vector3.Distance(enemy.transform.position, player.transform.position);
        AnimatorStateInfo currInfo = enemy.anim.GetCurrentAnimatorStateInfo(0);
        timeDelay = currInfo.length;

        
        enemy.anim.SetBool("Attack", true); // this animation include key event attack
        if (dis < enemy.DistanceToChase)
        {
            return enemy.chase;   //Tai enum attack , tức là lúc attack phải set des tại chỗ để tấn công , sau đó set chase vì nhân vật chắc chắc k di chuyen quá xa
        }
        else
        {
            return enemy.idle;
        }
    }
}


public class IdleState : IEnemyState
{


    public IEnemyState DoState(NormalZombie enemy, Player player , ref float timeDelay)
    {
        enemy.agent.isStopped = true;
        timeDelay = 0.2f;
        float dis = Vector3.Distance(enemy.transform.position, player.transform.position);
        if (dis < enemy.DistanceToChase)
        {

            return enemy.chase;
        }
        else
        {
            enemy.anim.SetBool("Chasing", false);
            return enemy.wander;
        }
    }
}

public class WanderState : IEnemyState
{
    public IEnemyState DoState(NormalZombie enemy, Player player , ref float timeDelay)
    {
        enemy.agent.isStopped = false;
        timeDelay = 1f;
        float dis = Vector3.Distance(enemy.transform.position, player.transform.position);
        if (dis < enemy.DistanceToChase)
        {
            enemy.agent.SetDestination(player.transform.position);
            return enemy.chase;
        }


        //Nếu ở là type run  thì không phải wander làm gì
        if (enemy.ZombieType != NormalZombie.TypeOfZombie.Walker)
        {
            enemy.anim.SetBool("Chasing", false);
            return enemy.wander;
        }

        if (enemy.changeDirec)
        {

            Vector3 newPos = new Vector3(enemy.transform.position.x + Random.Range(-1, 1), enemy.transform.position.y, enemy.transform.position.z + Random.Range(-5, 5));
            enemy.agent.SetDestination(newPos);
            enemy.changeDirec = false;
        }
        enemy.anim.SetBool("Chasing", true);
        return enemy.wander;

    }
}


public class ChaseState : IEnemyState
{
    public IEnemyState DoState(NormalZombie enemy, Player player , ref float timeDelay)
    {
        enemy.agent.isStopped = false;
    
        enemy.agent.SetDestination(player.transform.position);
        timeDelay = 0.2f;
        float dis = Vector3.Distance(enemy.transform.position, player.transform.position);
        if (dis > enemy.DistanceToChase)
        {
            
            enemy.anim.SetBool("Chasing", false);
            return enemy.idle;
        }
        else
        {
            enemy.anim.SetBool("Chasing", true);
            return enemy.chase;
        }
    }
}
