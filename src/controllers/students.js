// students
export async function getStudentData(year, id) {
  if (!year || id < 0) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/custom/${year}/${id}`,
      { credentials: 'include' }
    )
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.student_data;
  } catch (error) {
    console.error(error);
  }
}

export async function getStudents(year, stage) {
  if (!year || !stage) {
    return { students: null, err: "حدث خطأ" }
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/students/${year}/${stage}`, {
      credentials: 'include',
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { students: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const students = await response.json();
      return { students: students, err: null };
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { students: null, err: "حدث خطأ" }
  }
}

export async function deleteStudentC(year, id) {
  if (!year || id < 0) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/students/${year}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
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

export async function createStudent(year, obj) {
  if (!year || !obj.student_id) {
    return { newStudent: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/students/${year}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { newStudent: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const data = await response.json();
      return { newStudent: data.student, err: null };
    }
  } catch (error) {
    console.log(error);
    return { newStudent: null, err: 'حدث خطأ' };
  }
}

export async function updateStudent(year, id, obj) {
  if (!year || id < 0) {
    return { newStudent: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/students/${year}/${id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
      credentials: 'include',
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { newStudent: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const data = await response.json();
      return { newStudent: data.student, err: null };
    }
  } catch (error) {
    console.log(error);
    return { newStudent: null, err: 'حدث خطأ' };
  }
}
// subjects
export async function getSubjects(year, stage) {
  if (!year || !stage) {
    return { subjects: null, err: "حدث خطأ" }
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/subjects/${year}/${stage}`, {
      credentials: 'include',
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { subjects: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const subjects = await response.json();
      return { subjects: subjects, err: null };
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { subjects: null, err: "حدث خطأ" }
  }
}

export async function createSubject(year, obj) {
  if (!year || !obj.subject_id) {
    return { newSubject: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/subjects/${year}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { newSubject: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const data = await response.json();
      return { newSubject: data.subject, err: null };
    }
  } catch (error) {
    console.log(error);
    return { newSubject: null, err: 'حدث خطأ' };
  }
}

export async function updateSubject(year, id, obj) {
  if (!year || id < 0) {
    return { newSubject: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/subjects/${year}/${id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { newSubject: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const data = await response.json();
      return { newSubject: data.subject, err: null };
    }
  } catch (error) {
    console.log(error);
    return { newSubject: null, err: 'حدث خطأ' };
  }
}

export async function deleteSubjectC(year, id) {
  if (!year || id < 0) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/subjects/${year}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
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
// carryovers
export async function getCarryovers(year, stage) {
  if (!year || !stage) {
    return { carryovers: null, err: "حدث خطأ" }
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/carryovers/${year}/${stage}`, {
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { carryovers: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const carryovers = await response.json();
      return { carryovers: carryovers, err: null };
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { carryovers: null, err: "حدث خطأ" }
  }
}

export async function addCarryover(year, obj) {
  if (!obj.student_id || !obj.subject_id || !year) {
    return { newCarryover: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/carryovers/${year}`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
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

export async function deleteCarryover(year, id) {
  if (!year || id < 0) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/carryovers/${year}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
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
// exempted
export async function getExempteds(year, stage) {
  if (!year || !stage) {
    return { exempteds: null, err: "حدث خطأ" }
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/exempted/${year}/${stage}`, {
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { exempteds: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const exempteds = await response.json();
      return { exempteds: exempteds, err: null };
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { exempteds: null, err: "حدث خطأ" }
  }
}

export async function addExempt(year, obj) {
  if (!obj.student_id || !obj.subject_id || !year) {
    return { newExempt: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/exempteds/${year}`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
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

export async function deleteExempt(year, id) {
  if (!year || id < 0) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/exempteds/${year}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
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
// marks
export async function getMarks(year, stage) {
  if (!year || !stage) {
    return { marks: null, err: "حدث خطأ" }
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/marks/${year}/${stage}`, {
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json();
      return { marks: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const marks = await response.json();
      return { marks: marks, err: null };
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { marks: null, err: "حدث خطأ" }
  }
}

export async function deleteMarkC(year, id) {
  if (!year || id < 0) {
    return null;
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/marks/${year}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
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

export async function addMark(year, obj) {
  if (!obj.student_id || !obj.subject_id || !year) {
    return { newMark: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/marks/${year}`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
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

export async function editMark(year, id, obj) {
  if (id < 0 || !year) {
    return { newMark: null, err: 'حدث خطأ' };
  }
  try {
    const response = await fetch(`https://collegecm.work.gd/v1/marks/${year}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
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
