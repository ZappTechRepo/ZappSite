//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Homemation.WebAPI.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Audit_Log
    {
        public long id { get; set; }
        public System.DateTime created { get; set; }
        public string referenceNumber { get; set; }
        public string createdUser { get; set; }
        public int originator { get; set; }
        public int action { get; set; }
        public int actionType { get; set; }
        public string Descritpion { get; set; }
    }
}
