export async function getAuth() {
  try {
    const response = await fetch('https://collegecm.work.gd/v1/auth/status', {
      credentials: 'include',
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    if (data) {
      return data.user;
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}

export async function login(creds) {
  try {
    const response = await fetch('https://collegecm.work.gd/v1/login', {
      method: "POST",
      body: JSON.stringify(creds),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = response.json();
      return { user: null, err: errorData.err || 'حدث خطأ' };
    }
    const data = await response.json();
    if (data) {
      return { user: data.user, err: null };
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}

export async function logout() {
  try {
    const response = await fetch('https://collegecm.work.gd/v1/logout', {
      method: "POST",
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error || 'حدث خطأ';
    }
    return null;
  } catch (error) {
    console.error('Failed to logout', error);
  }
}
