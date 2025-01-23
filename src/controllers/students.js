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
