 using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Lockrotation : MonoBehaviour
{
    // Start is called before the first frame update
    Transform t;

    void Start()
    {
        t = transform;
        StartCoroutine(lockRotation());
    }

    IEnumerator lockRotation()
    {
        t.eulerAngles = new Vector3(t.eulerAngles.x, t.eulerAngles.y, 0);
        yield return new WaitForSeconds(1f);
        StartCoroutine(lockRotation());
    }
}


















