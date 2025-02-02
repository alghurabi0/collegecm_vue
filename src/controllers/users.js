// users
export async function getUsers() {
  try {
    const response = await fetch("https://collegecm.work.gd/v1/users", {
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { users: null, err: errorData.err || 'حدث خطأ' };
    } else {
      const users = await response.json();
      return { users: users, err: null };
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { students: null, err: "حدث خطأ" }
  }
}
export async function deleteUserC(id) {
  if (id < 0) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/users/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error || 'حدث خطأ'
    }
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function createUser(obj) {
  if (!obj.username || !obj.password) {
    return { newUser: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/users`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { newUser: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const data = await response.json();
      return { newUser: data.user, err: null };
    }
  } catch (error) {
    console.log(error);
    return { newUser: null, err: 'حدث خطأ' };
  }
}
export async function updateUser(id, obj) {
  if (id < 0 || !obj) {
    return { newUser: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/users/${id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { newUser: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const data = await response.json();
      return { newUser: data.user, err: null };
    }
  } catch (error) {
    console.log(error);
    return { newUser: null, err: 'حدث خطأ' };
  }
}
// privileges
export async function getPrivileges(user_id) {
  if (user_id < 0 || user_id === undefined) {
    return { privileges: null, err: "حدث خطأ" }
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/privileges/${user_id}`, {
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { users: null, err: errorData.err || 'حدث خطأ' };
    } else {
      const privileges = await response.json();
      return { privileges: privileges, err: null };
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { privileges: null, err: "حدث خطأ" }
  }
}
export async function createPrivilege(obj) {
  if (!obj.user_id || !obj.year) {
    return { newPrivilege: null, err: "حدث خطأ" }
  }
  try {
    const response = await fetch("https://collegecm.work.gd/v1/privileges", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { newPrivilege: null, err: errorData.error || 'حدث هطأ' };
    } else {
      const data = await response.json();
      return { newPrivilege: data.privilege, err: null };
    }
  } catch (error) {
    console.error(error);
  }
}
