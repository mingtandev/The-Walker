using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class Enemy : MonoBehaviour
{
    // Start is called before the first frame update
        public enum TypeOfZombie
    {
        Walker,
        Runners,
        Malaise,
        Bigcityboi
    }

    public int heath;
    public GameObject attackPoint;
    public NavMeshAgent agent;
    public Player player;
    protected bool isDeath;
    protected int damage;


    protected void AttackInRange()   //this function add to key event
    {
        Collider[] obj = Physics.OverlapSphere(attackPoint.transform.position, 1f, LayerMask.GetMask("PlayerLayer"));
        if (obj.Length > 0)
        {
            if (obj[0].tag == "Player")
            {
                player.Heal -= damage;
                Debug.Log(player.Heal);
            }
        }
    }
}
