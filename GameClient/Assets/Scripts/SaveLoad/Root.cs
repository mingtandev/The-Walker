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



public class Others
{
    public string id { get; set; }
    public List<string> fields { get; set; }

    public Others()
    {
        id = null;
        fields = new List<string>();
    }
}

public class Manage
{
    public string type { get; set; }
    public string collection { get; set; }
    public string task { get; set; }
    public DateTime date { get; set; }
    public Others others { get; set; }

    public Manage()
    {
        type = null;
        collection = null;
        task = null;
        date = new DateTime();
        others = new Others();
    }
}

public class Others2
{
    public string id { get; set; }
    public List<string> fields { get; set; }

    public Others2()
    {
        id = null;
        fields = new List<string>();
    }
}

public class Personal
{
    public string type { get; set; }
    public string collection { get; set; }
    public string task { get; set; }
    public DateTime date { get; set; }
    public Others2 others { get; set; }

    public Personal()
    {
        type = null;
        collection = null;
        task = null;
        date = new DateTime();
        others = new Others2();
}
}

public class History
{
    public List<Manage> manage { get; set; }
    public List<Personal> personal { get; set; }

    public History()
    {
        manage = new List<Manage>();
        personal = new List<Personal>();
    }
}

public class Details
{
    public int Loadammo { get; set; }
    public int Totalammo { get; set; }
    public string Type { get; set; }
    public double Timedelay { get; set; }
    public int Damage { get; set; }
    public int Bulletspeed { get; set; }
    public int Bulletdrop { get; set; }


    public Details()
    {
        Loadammo = 0;
        Totalammo = 0;
        Type = null;
        Timedelay = 0;
        Damage = 0;
        Bulletspeed = 0;
        Bulletdrop = 0;

    }
}

public class Guns
{
    public string id { get; set; }
    public string name { get; set; }
    public Details details { get; set; }
    public string thumbnail { get; set; }
    public string description { get; set; }
    public DateTime boughtAt { get; set; }

    public Guns()
    {
        id = null;
        name = null;
        details = new Details();
        boughtAt = new DateTime();
        thumbnail = null;
        description = null;
    }
}

public class Details2
{
    public int HP { get; set; }
    public int Ammo { get; set; }
    public int Damagebuff { get; set; }
    public int Bulletspeeddown { get; set; }
    public double Bulletdropdown { get; set; }

    public Details2()
    {
        HP = 0;
        Ammo = 0;
        Damagebuff = 0;
        Bulletspeeddown = 0;
        Bulletdropdown = 0;
    }
}

public class Hat
{
    public string id { get; set; }
    public string name { get; set; }
    public Details2 details { get; set; }
    public string thumbnail { get; set; }
    public string description { get; set; }
    public DateTime boughtAt { get; set; }

    public Hat()
    {
        id = null;
        name = null;
        details = new Details2();
        boughtAt = new DateTime();
        thumbnail = null;
        description = null;
    }
}

public class Details3
{
    public int HP { get; set; }
    public int Ammo { get; set; }
    public double Damagebuff { get; set; }
    public int Bulletspeeddown { get; set; }
    public double Bulletdropdown { get; set; }

    public Details3()
    {
        HP = 0;
        Ammo = 0;
        Damagebuff = 0;
        Bulletspeeddown = 0;
        Bulletdropdown = 0;
    }
}

public class Outfit
{
    public string id { get; set; }
    public string name { get; set; }
    public Details3 details { get; set; }
    public string thumbnail { get; set; }
    public string description { get; set; }
    public DateTime boughtAt { get; set; }

    public Outfit()
    {
        id = null;
        name = null;
        details = new Details3();
        boughtAt = new DateTime();
        thumbnail = null;
        description = null;
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

public class User
{
    public string roles { get; set; }
    public bool isVerified { get; set; }
    public int cash { get; set; }
    public History history { get; set; }
    public Items items { get; set; }
    public string _id { get; set; }
    public string name { get; set; }
    public string email { get; set; }
    public string slugName { get; set; }
}

public class RootUser
{
    public string msg { get; set; }
    public User user { get; set; }
}




//public class Guns
//{
//    public string id { get; set; }
//    public string name { get; set; }
//    public string detail { get; set; }
//    public DateTime boughtAt { get; set; }
//    public Guns()
//    {
//        id = null;
//        name = null;
//        detail = null;
//        boughtAt = new DateTime();
//    }
//}

//public class Hat
//{
//    public string id { get; set; }
//    public string name { get; set; }
//    public string detail { get; set; }
//    public DateTime boughtAt { get; set; }
//    public Hat()
//    {
//        id = null;
//        name = null;
//        detail = null;
//        boughtAt = new DateTime();
//    }
//}

//public class Outfit
//{
//    public string id { get; set; }
//    public string name { get; set; }
//    public string detail { get; set; }
//    public DateTime boughtAt { get; set; }
//    public Outfit()
//    {
//        id = null;
//        name = null;
//        detail = null;
//        boughtAt = new DateTime();
//    }
//}

//public class Items
//{
//    public List<Guns> guns { get; set; }
//    public List<Hat> hats { get; set; }
//    public List<Outfit> outfits { get; set; }
//    public Items()
//    {
//        guns = new List<Guns>();
//        hats = new List<Hat>();
//        outfits = new List<Outfit>();
//    }
//}

//public class Request
//{
//    public string type { get; set; }
//    public string url { get; set; }
//    public Request()
//    {
//        type = null;
//        url = null;
//    }
//}

//public class UserItem
//{
//    public string _id { get; set; }
//    public string userId { get; set; }
//    public int coin { get; set; }
//    public Items items { get; set; }
//    public Request request { get; set; }
//    public UserItem()
//    {
//        _id = null;
//        userId = null;
//        coin = 0;
//        items = null;
//        request = null;
//    }
//}

//public class ListItem
//{
//    public string msg { get; set; }
//    public UserItem userItem { get; set; }

//}
