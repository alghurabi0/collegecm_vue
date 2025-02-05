export const getYears = async () => {
  try {
    const response = await fetch('https://collegecm.work.gd/v1/years', {
      credentials: 'include',
    })
    if (!response.ok) {
      const errorData = await response.json()
      return { years: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const years = await response.json();
      return { years: years.years, err: null };
    }
  } catch (err) {
    console.log(err);
    return { years: null, err: 'حدث خطأ' };
  }
}

export const createYear = async (year) => {
  try {
    const response = await fetch('https://collegecm.work.gd/v1/years', {
      method: "POST",
      body: JSON.stringify({ year }),
      credentials: 'include',
    })
    if (!response.ok) {
      const errorData = await response.json()
      return { newYear: null, err: errorData.error || 'حدث خطأ' };
    } else {
      const data = await response.json();
      return { newYear: data.year, err: null };
    }
  } catch (err) {
    console.log(err);
    return { newYear: null, err: 'حدث خطأ' };
  }
}

export const deleteYearC = async (year) => {
  try {
    const response = await fetch('https://collegecm.work.gd/v1/years', {
      method: 'DELETE',
      body: JSON.stringify({ year }),
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

export const determineStage = (stage) => {
  switch (stage) {
    case '1':
      return 'الاولى';
    case '2':
      return 'الثانية';
    case '3':
      return 'الثالثة';
    case '4':
      return 'الرابعة';
    case '5':
      return 'الخامسة';
    case '6':
      return 'السادسة';
    case 'all':
      return 'all';
    default:
      return null;
  }
}
