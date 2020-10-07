using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class Sound
{
    public string name;

    public AudioClip clip;

    [Range(0,1)]
    public float volume;

    [Range(.1f,3)]
    public float pitch;

    public AudioSource source;


    public bool loop;
}
