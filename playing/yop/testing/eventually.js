const delay = 50;

export const eventually = async (...params) => {
  let [page, verify, timeout] = params;
  if (typeof page === "function") {
    timeout = verify;
    verify = page;
    page = undefined;
  }
  const tries = timeout ? timeout / delay : 30;
  return new Promise(async (resolve, reject) => {
    let credit = tries;
    const tryNow = async () => {
      try {
        await verify();
        resolve();
      } catch (error) {
        credit--;
        if (credit === 0) {
          if (!!page) {
            console.log("FAILURE\nactual body:", await page.html());
          }
          reject(error);
        } else {
          setTimeout(tryNow, delay);
        }
      }
    };
    await tryNow();
  });
};
