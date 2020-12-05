using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Token
{

    public string msg { get; set; }
    public string token { get; set; }
    public string refreshToken { get; set; }
}

public class PlayerData
{
    public string _id { get; set; }
    public string roles { get; set; }
    public string name { get; set; }
    public int cash { get; set; }
    public string slugName { get; set; }
    public string email { get; set; }
    public int iat { get; set; }
    public int exp { get; set; }
}


public class Guns
{
    public string id { get; set; }
    public string name { get; set; }
    public string detail { get; set; }
    public DateTime boughtAt { get; set; }
    public Guns()
    {
        id = null;
        name = null;
        detail = null;
        boughtAt = new DateTime();
    }
}

public class Hat
{
    public string id { get; set; }
    public string name { get; set; }
    public string detail { get; set; }
    public DateTime boughtAt { get; set; }
    public Hat()
    {
        id = null;
        name = null;
        detail = null;
        boughtAt = new DateTime();
    }
}

public class Outfit
{
    public string id { get; set; }
    public string name { get; set; }
    public string detail { get; set; }
    public DateTime boughtAt { get; set; }
    public Outfit()
    {
        id = null;
        name = null;
        detail = null;
        boughtAt = new DateTime();
    }
}

public class Items
{
    public List<Guns> guns { get; set; }
    public List<Hat> hats { get; set; }
    public List<Outfit> outfits { get; set; }
    public Items()
    {
        guns = new List<Guns>();
        hats = new List<Hat>();
        outfits = new List<Outfit>();
    }
}

public class Request
{
    public string type { get; set; }
    public string url { get; set; }
    public Request()
    {
        type = null;
        url = null;
    }
}

public class UserItem
{
    public string _id { get; set; }
    public string userId { get; set; }
    public int coin { get; set; }
    public Items items { get; set; }
    public Request request { get; set; }
    public UserItem()
    {
        _id = null;
        userId = null;
        coin = 0;
        items = null;
        request = null;
    }
}

public class ListItem
{
    public string msg { get; set; }
    public UserItem userItem { get; set; }

}
