using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ThrowBomb : MonoBehaviour
{
    // Start is called before the first frame update
    public LayerMask layer;
    public GameObject cursor;
    public Transform pointThrow;

    public GameObject grenadePrefab;
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        CursorTarget();
    }

    void CursorTarget()
    {
        Ray camray = Camera.main.ScreenPointToRay(Input.mousePosition);

        RaycastHit hit;

        if(Physics.Raycast(camray,out hit , 100f , layer))
        {
            cursor.transform.position = hit.point + Vector3.up*0.1f;
            Vector3 Vo = CalVelocity(hit.point , pointThrow.position , 1);

            if(Input.GetMouseButtonDown(0))
            {
                Rigidbody obj = Instantiate(grenadePrefab , pointThrow.position , Quaternion.identity).GetComponent<Rigidbody>();
                obj.velocity = Vo;
            }

        }
    }


    Vector3 CalVelocity(Vector3 target, Vector3 origin, float time)
    {
        Vector3 distance = target - origin;

        Vector3 distanceXZ = distance;

        distanceXZ.y = 0;

        float Sy = distance.y;
        float Sxz = distanceXZ.magnitude;


        float Vxz = Sxz/time;

        float Vy = Sy/time + 0.5f*Mathf.Abs(Physics.gravity.y)*time;

        Vector3 res = distanceXZ.normalized;
        res *= Vxz;

        res.y = Vy;


        return res;
        
    }
}
