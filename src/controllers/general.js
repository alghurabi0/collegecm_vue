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
