export async function getStudentData(id) {
  if (id == null) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/custom/${id}`)
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.student_data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCarryover(id) {
  if (id == null) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/carryovers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error
    }
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteExempt(id) {
  if (id == null) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/exempteds/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error
    }
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteMark(id) {
  if (id == null) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/marks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addCarryover(obj) {
  if (!obj.student_id || !obj.subject_id) {
    return { newCarryover: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch('https://collegecm.work.gd/v1/carryovers', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { newCarryover: null, err: errorData.error };
    } else {
      const newCarryover = await response.json();
      return { newCarryover: newCarryover.carryover, err: null };
    }
  } catch (err) {
    console.log(err);
    return { newCarryover: null, err: 'حدث خطأ' };
  }
}

export async function addExempt(obj) {
  if (!obj.student_id || !obj.subject_id) {
    return { newExempt: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch('https://collegecm.work.gd/v1/exempteds', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { newExempt: null, err: errorData.error };
    } else {
      const newExempt = await response.json();
      return { newExempt: newExempt.exempted, err: null };
    }
  } catch (err) {
    console.log(err);
    return { newExempt: null, err: 'حدث خطأ' };
  }
}

export async function addMark(obj) {
  if (!obj.student_id || !obj.subject_id) {
    return { newMark: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch('https://collegecm.work.gd/v1/marks', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { newMark: null, err: errorData.error };
    } else {
      const newMark = await response.json();
      return { newMark: newMark.mark, err: null };
    }
  } catch (err) {
    console.log(err);
    return { newMark: null, err: 'حدث خطأ' };
  }
}
