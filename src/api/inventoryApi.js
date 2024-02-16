import * as constants from "../constants/CONSTANT";
import authApi from "../api/authApi";

const inventoryApi = {
  //.............. Fetch Project By active Id .............................
  async findActiveProject(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/projects/" + id + "/active",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const result = await response.json();
    return result;
  },

  //.............. Fetch Property By showonweb Id .............................
  async findActiveProperty(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/properties/" + id + "/active",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const result = await response.json();
    return result;
  },

  //************************ Contacts ***********************************//
  async fetchContacts() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/contacts", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response.status === 401) {
      authApi.logout();
    }
    const result = await response.json();
    //.log(result);
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  //.............. Fetch Contact By Id .............................
  async fetchContact(id) {
    //.log(id);
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/contacts/" + id, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const result = await response.json();

    return result;
  },
  async fetchAttendanceById(id) {
    //.log(id);
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/attendance/" + id, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const result = await response.json();

    return result;
  },


  async createUser(user) {
    const token = localStorage.getItem("token");

    let response = await fetch(
      constants.API_BASE_URL + "/api/auth/createuser",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(user),
      }
    );
    //.log("response", response);
    return await response.json();
  },

  async saveUser(user) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/auth/" + user.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(user),
      }
    );
    ////.log('response',response)

    return await response.json();
  },
  async deleteImage() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/auth/myimage", {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
      const result = await response.json()
      //.log('result',result)
       return result;
    
  },

  async deleteMessage(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/messages/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    return await response.json();
  },
  async createMessage(message) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/messages/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(message),
    });

    return await response.json();
  },
  async fetchMessages(pid) {
    const token = localStorage.getItem("token");
    ///"+pid+"/*
    let response = await fetch(
      constants.API_BASE_URL + "/api/messages/" + pid + "/*",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    ////.log(response)
    const result = await response.json();
    ////.log(result);
    if (result.length > 0) {
      ////.log(result)
      return result;
    }
    return null;
  },

  async fetchUnreadMessages() {
    const token = localStorage.getItem("token");
    ///"+pid+"/*
    let response = await fetch(
      constants.API_BASE_URL + "/api/messages/unread",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    ////.log(response)
    const result = await response.json();
    ////.log(result);
    if (result.length > 0) {
      ////.log(result)
      return result;
    }
    return null;
  },
  async fetchUsers() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/auth/users", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const result = await response.json();

    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async createContact(contact) {
    ////.log('if contact create call');
    ////.log(contact);
    const token = localStorage.getItem("token");

    let response = await fetch(constants.API_BASE_URL + "/api/contacts", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(contact),
    });
    //.log(response);
    return await response.json();
  },
  //.............. Fetch Lead By Id .............................
  async fetchUserById(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/auth/users/" + id,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const result = await response.json();
    ////.log('response',result)
    return result;
  },

  /********************************** CReate Property*************************** */
  async createProperty(property) {
    ////.log('if contact create call');
    ////.log(property);
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/properties", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(property),
    });
    ////.log(response);
    return await response.json();
  },

  /********************************** CReate Project*************************** */
  async createProject(project) {
    ////.log('if contact create call');
    ////.log(property);
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/projects", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(project),
    });
    ////.log(response);
    return await response.json();
  },

  /********************************** Save Contact*************************** */

  async saveContact(contact) {
    //.log("====Save contact===");
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/contacts/" + contact.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(contact),
      }
    );
    //.log(response);
    return await response.json();
  },
  async saveDailyTask(dailyTask) {
    //.log("====Save dailytask===");
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/dailytasks/" + dailyTask.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(dailyTask),
      }
    );
    //.log(response);
    return await response.json();
  },

  /********************************** Save Property*************************** */
  async saveProperty(property) {
    //.log("if edit save contact call");
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/properties/" + property.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(property),
      }
    );
    ////.log(response);
    return await response.json();
  },

  /********************************** Save Project*************************** */

  async saveProject(project) {
    //.log("if edit save contact call");
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/projects/" + project.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(project),
      }
    );
    ////.log(response);
    return await response.json();
  },

  /********************************** delete Contact*************************** */

  async deleteContact(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/contacts/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    return await response.json();
  },

  /********************************** delete Project*************************** */

  async deleteProject(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/projects/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    return await response.json();
  },

  //************************ Lead ***********************************//

  async fetchLeads() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/leads", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 401) {
      authApi.logout();
    }

    const result = await response.json();
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async fetchLead(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/leads/" + id, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const result = await response.json();

    return result;
  },

  async fetchLeadsTask() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/tasks/task-for-leads/", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 401) {
      authApi.logout();
    }

    const result = await response.json();
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  //************************ Prperty ***********************************//

  async fetchProperties() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/properties", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 401) {
      authApi.logout();
    }

    const result = await response.json();

    if (result.length > 0) {
      return result;
    }
    return null;
  },

  //************************ Project ***********************************//

  async fetchProjects() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/projects", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 401) {
      authApi.logout();
    }

    const result = await response.json();

    if (result.length > 0) {
      return result;
    }
    return null;
  },

  //************************ Lead ***********************************//

  async fetchTransactions() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/transactions", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 401) {
      authApi.logout();
    }

    const result = await response.json();

    if (result.length > 0) {
      return result;
    }
    return null;
  },
  async createTransaction(transaction) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/transactions", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(transaction),
    });

    if (response.status === 401) {
      authApi.logout();
    }

    const result = await response.json();

    return result;
  },

  /******************************** Property***************** */

  async fetchProperty(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/properties/" + id,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.status === 401) {
      authApi.logout();
    }
    const result = await response.json();

    return result;
  },

  //----------------------------------ReletedProperties-----------------------------------
  async findByOwnerId(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/projects/" + id + "/properties",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const result = await response.json();
    return result;
  },

  /******************************** Project***************** */

  async fetchProject(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/projects/" + id, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 401) {
      authApi.logout();
    }
    const result = await response.json();
    return result;
  },

  async createLead(lead) {
    //.log('if data enter', lead,constants.API_BASE_URL + "/api/leads");
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/leads", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(lead),
    });
    //.log('response in lead',response)
    return await response.json();
  },
  // ******************************create product ***************************************
  async createProduct(product) {
    ////.log('if product create call');
    ////.log(product);
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/products", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(product),
    });
    ////.log(response);
    return await response.json();
  },

  async saveLead(lead) {
    ////.log('Enter lead data',lead)
    const token = localStorage.getItem("token");
    //.log('values in inv',lead);
    let response = await fetch(
      constants.API_BASE_URL + "/api/leads/" + lead.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(lead),
      }
    );
   const result = await response.json();
   //.log('result',result)

   return result;
  },

  //*************************************save Product********************************************* */
  async saveProduct(product) {
    ////.log('if edit enter for save')
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/products/" + product.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(product),
      }
    );
    ////.log(response)
    return await response.json();
  },
  // ***********************Product************************************//
  async fetchProduct() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/products", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const result = await response.json();
    ////.log(result)
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async deleteProduct(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/products/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return await response.json();
  },

  async deleteLead(id) {
    ////.log('delete enter in inventory')
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/leads/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    ////.log(response)
    return await response.json();
  },
  //************** order **************** */
  async deleteOrder(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/leads/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    return await response.json();
  },

  async fetchOrder() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/orders", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const result = await response.json();
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async deletOrder(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/orders/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    ////.log(response)
    return await response.json();
  },

  async createOrder(order) {
    ////.log('order enter to create in inventory')
    const token = localStorage.getItem("token");
    ////.log(order)
    let response = await fetch(constants.API_BASE_URL + "/api/orders", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(order),
    });
    ////.log(response)
    return await response.json();
  },

  async fetchOrderById(row) {
    ////.log('order enter to show data in pdf with row.id')
    const token = localStorage.getItem("token");
    ////.log(row)
    let response = await fetch(
      constants.API_BASE_URL + "/api/orders/" + row.id,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    ////.log(response)

    return await response.json();
  },

  //************************ Task ***********************************//
  async fetchTasks(pid) {
    const token = localStorage.getItem("token");
    ///"+pid+"/*
    let response = await fetch(
      constants.API_BASE_URL + "/api/tasks/" + pid + "/*",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    ////.log(response)
    const result = await response.json();
    ////.log(result);
    if (result.length > 0) {
      ////.log(result)
      return result;
    }
    return null;
  },
  async fetchAllMeetings(today) {
    const token = localStorage.getItem("token");

    let response = await fetch(
      constants.API_BASE_URL + "/api/tasks/meetings/today",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    ////.log(response)
    const result = await response.json();
    ////.log(result);
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async createTask(task) {
    const token = localStorage.getItem("token");
    //.log('task:', task);
    let response = await fetch(constants.API_BASE_URL + "/api/tasks/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(task),
    });

    return await response.json();
  },
  async createDailyTask(task) {
    const token = localStorage.getItem("token");
    //.log('task:', task);
    let response = await fetch(constants.API_BASE_URL + "/api/dailytasks/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(task),
    });

    return await response.json();
  },

  async saveTask(task) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/tasks/" + task.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(task),
      }
    );

    return await response.json();
  },

  async deleteTask(id) {
    //.log('deleteTask id' , id);
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/tasks/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    return await response.json();
  },
  async deleteDailyTask(id) {
    //.log('deleteTask id' , id);
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/dailytasks/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    return await response.json();
  },

  async fetchDailyTaskById(id) {
    //.log('id' , id);
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/dailytasks/" + id, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return await response.json();
  },


  async createFile(pid, formData) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/files/" + pid, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const result = await response.json();

    //.log("createFile result --> ",result);

    return result;
  },

  //************************ files ***********************************//

  async fetchFiles(pid) {
    ////.log(pid)
    const token = localStorage.getItem("token");
    //

    let response = await fetch(
      constants.API_BASE_URL + "/api/files/" + pid + "/all",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const result = await response.json();
    ////.log('result',result);
    ////.log(response)
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async fetchLeadEmailFiles(pid) {
    ////.log(pid)
    const token = localStorage.getItem("token");
    //

    let response = await fetch(
      constants.API_BASE_URL + "/api/files/lead-email",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const result = await response.json();
    //.log('lead-email result --> ',result);
    ////.log(response)
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async downloadFiles(file) {
    ////.log("save",file.id);
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/files/" + file.id + "/download",
      {
        method: "GET",
        //mode: "cors",

        headers: {
          Authorization: token,
        },
      }
    );
    const fileBody = await response.blob();

    return fileBody;
  },

  async saveFiles(file) {
    ////.log("save",file);

    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/files/" + file.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(file),
      }
    );

    return await response.json();
  },

  async deleteFile(id) {
    ////.log('delete call',id)
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/files/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    return await response.json();
  },

  async deleteProperty(id) {
    ////.log('delete call',id)
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/properties/" + id,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    return await response.json();
  },
  async deletePropertyAreadetails(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/propertydetails",
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(id),
      }
    );
    return await response.json();
  },

  async fetchPurchaseOrder() {
    ////.log('enter to fetch purchase order')
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/purchaseorders", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const result = await response.json();
    ////.log(result)
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async createPurchaseOrder(purchase) {
    ////.log('purchase enter to create in order')
    const token = localStorage.getItem("token");
    ////.log(purchase)
    let response = await fetch(constants.API_BASE_URL + "/api/purchaseorders", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(purchase),
    });
    ////.log(response)
    return await response.json();
  },

  async savePurchaseOrder(purchase) {
    const token = localStorage.getItem("token");
    ////.log(purchase);
    let response = await fetch(
      constants.API_BASE_URL + "/api/purchaseorders/" + purchase.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(purchase),
      }
    );
    ////.log(response)
    return await response.json();
  },
  async saveAttendance(attendance) {
    const token = localStorage.getItem("token");
    ////.log(purchase);
    let response = await fetch(
      constants.API_BASE_URL + "/api/attendance/" + attendance.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(attendance),
      }
    );
    ////.log(response)
    return await response.json();
  },


  async deletePurchaseOrder(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/purchaseorders/" + id,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    ////.log(response)
    return await response.json();
  },

  async updateUser(user) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      //constants.API_BASE_URL + "/api/auth/" + user.id,
      constants.API_BASE_URL + "/api/auth/updatepassword",
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(user),
      }
    );

    return await response.json();
  },

  // --------------------------------- Report ----------------------------------------

  async fetchReports() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/reports", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const result = await response.json();
    if (result.length > 0) {
      return result;
    }
    return null;
  },
  async sendEmailTask(task) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/tasks/sendemail",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(task),
      }
    );

    const result = await response.json();

      //.log("sendEmailTask --> ",result);

    return result
  },

  async fetchReportsById(row) {
    const token = localStorage.getItem("token");
    //.log(row);
    let response = await fetch(
      constants.API_BASE_URL + "/api/reports/" + row.id,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    //.log(response);
    return await response.json();
  },

  async fetchCompanyInfoById(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/company/" + id, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    // //.log("response  @@" , response);
    return await response.json();
  },

  async syncSFRecords(request_body) {
    //.log("request_body ", request_body);
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/salesforce/sf/syncrecord",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(request_body),
      }
    );
    return await response.json();
  },

  async fetchAndSaveSalesforceToken(code, companyid) {
    const token = localStorage.getItem("token");
    let request_body = {
      code: code,
    };
    let response = await fetch(
      constants.API_BASE_URL + "/api/salesforce/" + companyid,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(request_body),
      }
    );
    return await response.json();
  },

  async fetchFilespic(pid, type) {
    //.log(pid);
    const token = localStorage.getItem("token");
    //

    let response = await fetch(
      constants.API_BASE_URL + "/api/files/" + pid + "/projects/plan/" + type,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const result = await response.json();
    //.log("resultfetchFilespic", result);
    ////.log(response)
    if (result) {
      return result;
    }
    return null;
  },

  //Added by rahul joshi : 17-08-2023
  async fetchEmails() {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/company/from-emails",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const result = await response.json();
    //.log('result',result);
    return result;
  },
  async fetchCountOfProperties() {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/dashboard/totalproject/",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const result = await response.json();
    return result;
  },

  //Added by rahul joshi : 17-08-2023
  async fetchCountOfContacts() {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/dashboard/totalcontacts/",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const result = await response.json();
    return result;
  },
  //Added by rahul joshi : 17-08-2023
  async fetchCountOfLeads() {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/dashboard/totalleads/",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const result = await response.json();
    return result;
  },

  //Added by rahul joshi : 17-08-2023
  async fetchTotalIncome() {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/dashboard/totalincome/",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const result = await response.json();
    return result;
  },

  async getLoginUserData() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/auth/getuser", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const result = await response.json();
    ////.log('----->', JSON.stringify(result))

    return result;
  },

  async saveStaffMemberEditProfile(userid, selectedFiles, staffMember) {
    ////.log("Enter staff data", userid);
    ////.log('selectedFiles',selectedFiles)
    const formData = new FormData();
    formData.append("file", selectedFiles);
    formData.append("staffRecord", staffMember);
    ////.log([...formData])
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/auth/" + userid + "/profile",
      {
        method: "PUT",
        mode: "cors",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    );
    ////.log(response);
    return await response.json();
  },
  async createBackup() {
    const token = localStorage.getItem("token");

    let response = await fetch(constants.API_BASE_URL + "/api/backup", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      // body: JSON.stringify(lead),
    });
    return await response.json();
  },

  async fetchBackups() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/backup", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response.status === 401) {
      authApi.logout();
    }
    const result = await response.json();
    if (result.length > 0) {
      return result;
    }
    return null;
  },
  async downloadBackupFile(filename) {
    ////.log("save", fileid);
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/backup/download/" + filename,
      {
        method: "GET",
        //mode: "cors",

        headers: {
          Authorization: token,
        },
      }
    );
    const fileBody = await response.blob();
    //.log("filebody in api ", fileBody);
    return fileBody;
  },

  async deleteBackupFile(filename) {
    ////.log("save", fileid);
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/backup/delete/" + filename,
      {
        method: "GET",
        //mode: "cors",

        headers: {
          Authorization: token,
        },
      }
    );
    return await response.json();
  },

  async fetchReportByName(reportname) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/reports/byname/" + reportname,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (response.status === 401) {
      authApi.logout();
    }
    const result = await response.json();
    if (result.length > 0) {
      return result;
    }
    return null;
  },
  async fetchReportByDate(reportname,fromdate,todate) {
    const token = localStorage.getItem("token");
    //.log('path', constants.API_BASE_URL + "/api/reports/byname/"+ reportname +'/'+ fromdate + '/'+ todate,);
    let response = await fetch(
      constants.API_BASE_URL + "/api/reports/byname/"+ reportname +'/'+ fromdate + '/'+ todate,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const result = await response.json();
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async download3DFiles(fileid) {
    ////.log("save",file.id);
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/files/" + fileid + "/3dfile/download",
      {
        method: "GET", //mode: "cors",
        headers: {
          Authorization: token,
        },
      }
    );
    const fileBody = await response.blob();
    return fileBody;
  },

  async fetchTasksWithoutParent() {
    const token = localStorage.getItem("token");

    let response = await fetch(
      constants.API_BASE_URL + "/api/tasks/opentasks",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    ////.log(response)
    const result = await response.json();
    ////.log(result);
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async savetransactionRec(transaction) {
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/transactions/" + transaction.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(transaction),
      }
    );
    ////.log(response);
    return await response.json();
  },

  //----------------------------------ReletedLeads-----------------------------------
  async findByLeadId(id) {
    //.log("idasasdsa", id);
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/properties/" + id + "/relatedleads/",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const result = await response.json();
    return result;
  },


  async fetchAttendance() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/attendance" , {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const result = await response.json();
  return result;
},


  //----------------------------------CSV/Excel Lead Import-----------------------------------
  async csvExcelLeadImport(data) {

    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/oldleads", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();

    //.log("oldlead post result --> ",result);

    return result;
  },
  async fetchOldLeads() {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/oldleads", {

      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response.status === 401) {
      authApi.logout();
    }

    const result = await response.json();

    //.log("all leads --> ",result);

    if (result.length > 0) {

      return result;
    }
    return null;
  },


  async createAttendance(attendance) {
    const token = localStorage.getItem("token");
    //.log('attendance====:', attendance);
    let response = await fetch(constants.API_BASE_URL + "/api/attendance", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(attendance),
    }
  );
  const result = await response.json();

  //.log("oldlead post result --> ",result);

  return result;
},
  async deleteOldLead(id) {
    ////.log('delete enter in inventory')
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/oldleads/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
     // body: JSON.stringify(attendance),
    });

    return await response.json();
  },


  //************************ Todo ***********************************//

  async fetchTodos() {
    //.log("fetchTodos");
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/todo/", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    //.log('response' , response)

    if (response.status === 401) {
      authApi.logout();
    }

    const result = await response.json();
    //.log("result n fetch-->",result)
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async createToDO(todo) {
    //.log("createToDO",todo)
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/todo/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(todo),
    });

    const result2 = await response.json();
    //.log("Result in createToDO",result2)
    return result2;
  },

  async saveTodo(todo) {
    //.log('user in inv',todo);
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/todo/" + todo.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(todo),
      }
    );
  const result = await response.json();
   //.log('response in inv',result);
    return result;
  },

  async deleteDetailTodo(id) {
    //.log("deleteDetailTodo",id)
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/todo/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return await response.json();
  },


  async fetchDailyTasks() {
    const token = localStorage.getItem("token");

    let response = await fetch(
      constants.API_BASE_URL + "/api/dailytasks",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    ////.log(response)
    const result = await response.json();
    ////.log(result);
    if (result.length > 0) {
      return result;
    }
    return null;
  },
  // End added by yamini
  // Start added by yamini  22-11-2023 
  async saveTaskHistory(taskhistoryval) {
    const token = localStorage.getItem("token");
    //.log('taskhistoryval====:', taskhistoryval);
    let response = await fetch(constants.API_BASE_URL + "/api/taskhistory", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(taskhistoryval),
    });

    return await response.json();
  },

  async fetchTaskHistory(id) {
    //.log('id==' , id)
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/taskhistory/" + id, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.status === 401) {
      authApi.logout();
    }
    const result = await response.json();
    //.log('@@asdasd' , result)

    return result;
  },
    // End added by yamini  22-11-2023 



//   async fetchAttendanceById(id) {
//     //.log('id==' , id)
//     const token = localStorage.getItem("token");
//     let response = await fetch(constants.API_BASE_URL + "/api/attendance/" + id, {
//       method: "GET",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token,
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     });
// //.log('response' , response)
//     if (response.status === 401) {
//       authApi.logout();
//     }
//     const result = await response.json();

//     return result;
//   },


  // End added by yamini
  
   // });
    ////.log(response)
  //   const result = await response.json();
  //   //.log("old lead del result --> ",result);
  //   return result;
  // },

    //************************ Site Visit History  ***********************************//

    async fetchSiteVisits() {
      const token = localStorage.getItem("token");
      let response = await fetch(constants.API_BASE_URL + "/api/sitevisithistory", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const result = await response.json();

      //.log("sitevisit list result --> ",result);
      if (result.length > 0) {
        return result;
      }
      return null;
    },

    async fetchSiteVisit(id) {
      //.log(id);
      const token = localStorage.getItem("token");
      let response = await fetch(constants.API_BASE_URL + "/api/sitevisithistory/" + id, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const result = await response.json();

      //.log("sitevisit getbyid result --> ",result);
  
      return result;
    },

    async createSiteVisitHistory(user) {
      const token = localStorage.getItem("token");
  
      let response = await fetch(
        constants.API_BASE_URL + "/api/sitevisithistory",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(user),
        }
      );

      const result = await response.json()

      //.log("createSiteVisitHistory result", result);
      return result;
    },

    async saveSiteVisitHistory(property) {

      //.log("update site visit body --> ",property);

      //.log("if edit save contact call");
      const token = localStorage.getItem("token");
      let response = await fetch(
        constants.API_BASE_URL + "/api/sitevisithistory/" + property.id,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(property),
        }
      );
      ////.log(response);
      return await response.json();
    },

    async deleteSiteVisit(id) {
      const token = localStorage.getItem("token");
      let response = await fetch(constants.API_BASE_URL + "/api/sitevisithistory/" + id, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
  
      return await response.json();
    },
    //************************ Notification ***********************************//

    async fetchNotifications() {
      const token = localStorage.getItem("token");
      let response = await fetch(constants.API_BASE_URL + "/api/notification", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await response.json();
      //.log("Get notification result --> ",result);
      if (result.data?.length > 0) {
        return result.data;
      }
      return null;
    },

    async readNotification(id) {
      const token = localStorage.getItem("token");
      let response = await fetch(
        constants.API_BASE_URL + "/api/notification/" + id,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const result = await response.json();
      //.log("read notification result --> ",result);
      return result.data;
    },

    async deleteNotification(id) {
      const token = localStorage.getItem("token");
      let response = await fetch(constants.API_BASE_URL + "/api/notification/" + id, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const result = await response.json();
      //.log("delete notification result --> ",result);
  
      return result;
    },

    async clearAllNotification() {
      const token = localStorage.getItem("token");
      let response = await fetch(constants.API_BASE_URL + "/api/notification/all", {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const result = await response.json();
      //.log("alear all notification result --> ",result);
  
      return result;
    },

    //-------------------convert invertory--------------------//
    async createconvertinventory(data) {
      //.log("createconvertinventory",data)
      const token = localStorage.getItem("token");
      let response = await fetch(constants.API_BASE_URL + "/api/sitevisithistory/convert-inventory/"+ data.id, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(data),
      });
      //.log(response);
      return await response.json();
    },

  //-------------------PDF files--------------------//
  async fetchPdfFiles(pid) {
    
    const token = localStorage.getItem("token");
      let response = await fetch(
        constants.API_BASE_URL + "/api/files/generated-pdf/" + pid + "/all",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      const result = await response.json();
      //.log('get all pdf result --> ',result);
      ////.log(response)
      if (result.length > 0) {
        return result;
      }
      return null;
    },
    

  //-------------------Emails--------------------//
    async fetchEmailsLead(pid) {

      const token = localStorage.getItem("token");
  
      let response = await fetch(
        constants.API_BASE_URL + `/api/email/${pid}/all`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const result = await response.json();
      //.log('fetchEmailsLead result --> ',result);

      if (result.length > 0) {
        return result;
      }
      return null;
    },
    async fetchEmailView(id) {

      const token = localStorage.getItem("token");
  
      let response = await fetch(
        constants.API_BASE_URL + `/api/email/${id}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const result = await response.json();
      //.log('fetchEmailView result --> ',result);

      if (result) {
        return result;
      }
      return null;
    },
    async createEmailRecord(emailRecord) {
      const token = localStorage.getItem("token");
  
      let response = await fetch(
        constants.API_BASE_URL + "/api/email",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(emailRecord),
        }
      );
      const result = await response.json();
      // //.log("createEmailRecord result --> ",result);
      return result
    },
    //************************ Enquiry table-Added by saideep ***********************************//
    async fetchEnquiries() {
      const token = localStorage.getItem("token");
      let response = await fetch(constants.API_BASE_URL + "/api/enquiries", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await response.json();
      //.log("Get notification result --> ",result);
      if (result?.length > 0) {
        return result;
      }
      return null;
    },

    async fetchEnquiry(id) {
      //.log(id);
      const token = localStorage.getItem("token");
      let response = await fetch(constants.API_BASE_URL + "/api/enquiries/" + id, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const result = await response.json();
  
      return result;
    },

  async deleteEnquiry(id) {
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/enquiries/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    return await response.json();
  },

  async createconvertLead(data) {
    //.log("createconvertinventory",data)
    const token = localStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/enquiries/convert-lead/"+ data.id, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });
    //.log(response);
    return await response.json();
  },

  async fetchPropertyDetails(id) {
    console.log('id',id);
    const token = localStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/propertydetails/"+ id,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const result = await response.json();
    if (result.length > 0) {
      return result;
    }
    return null;
  },
};

export default inventoryApi;