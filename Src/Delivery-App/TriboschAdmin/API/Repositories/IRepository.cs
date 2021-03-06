﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TriboschAdmin;

namespace Homemation.WebAPI.Models
{


    public interface IAccountRepository
    {
        List<Customer> GetAllCustomer();
        List<Customer> SearchCustomerByName(string employeeName);
        Customer LoginCustomer(CustomerLogin cl);
        Customer GetCustomer(int CustomerID);
        Customer GetLogCustomer(int CustomerID);
        List<Customer> InsertCustomer(Customer e);
        List<Customer> UpdateCustomer(Customer e);
        List<Customer> DeleteCustomer(Customer e);
    }



    public interface IDocumentRepository
    {

        List<Document> GetAllDocuments(int UserId);
        List<Document> SearchDocumentByName(string employeeName);
        List<Document> GetDocumentByStatus(string pStatus);
        //List<DeliveryNote> GetDeliveryNoteDocuments(Guid UserId);
        Guid GetSalesRepGuidByCode(string repcode);
        int GetSalesRepGuidByToken(string token);
        string SaveSignature(string base64Img, string documentNumber);




    }



}