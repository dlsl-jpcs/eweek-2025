/**
 * DLSL email are formatted like the following:
 * 
 * firstName_secondName_middleName_suffix@dlsl.edu.ph
 * 
 * Let's just hope the school doesnt change the format :D
 * 
 * @param email dlsl email
 * @returns the name of the student
 */
export function parseNameFromDlslEmail(email) {

    const name = email.split('@')[0];
    const parts = name.split('_');

    return parts.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

/**
 * Uses the DLSL tap register API to get the student's email and department
 * 
 * TODO: is this legal? :o
 * @param id student id
 */
export async function getStudentInfo(id){

    const regKey = "20240515U60HB0";
    const api = "https://sandbox.dlsl.edu.ph/registration/event/helper.php";

    const response = await fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            action: "registration_tapregister",
            regkey: regKey,
            card_tag: id,
        }),
    });

    return response.json().then((data) => {
        // if data.department, data.email_address is empty, then the student is not registered
        if (!data.department || !data.email_address) {
            throw new Error("Student not registered");
        }

        if (data.department === "" || data.email_address === "") {
            throw new Error("Student not registered");
        }

        return data;
    });
}



/* 
app.post("/api/v1/player/register", async (req: Request, res: Response) => {
  // to make sure only us can register a user, this should be in a .env file shared with the tap-id client
  // TODO: Coffee

  // let authToken = req.body.authentication;
  // if (!authToken) {
  //     let responseJson =
  //     {
  //         status: 'invalid',
  //         message: 'Invalid request.',
  //     };

  //     return res.send(JSON.stringify(responseJson));
  // }

  let studentId = req.body.student_id;
  if (!studentId) {
    let responseJson = {
      status: "invalid",
      message: "Student ID is required.",
    };

    return res.send(JSON.stringify(responseJson));
  }

  const info = await getStudentInfo(studentId).catch(() => null);
  if (!info) {
    let responseJson = {
      status: "invalid",
      message: "Student ID is invalid.",
    };

    return res.send(JSON.stringify(responseJson));
  }

  let fullName = parseNameFromDlslEmail(info.email_address);
  let email = info.email_address;

  if (await isEmailExists(email)) {
    let code = getPlayerCodeFromStudentID(studentId);

    console.log("User already exists", email);

    let responseJson = {
      status: "user_already_exists",
      code: await code,
      name:
        email.split("@")[0].split("_")[0].charAt(0).toUpperCase() +
        email.split("@")[0].split("_")[0].slice(1),
    };

    return res.send(JSON.stringify(responseJson));
  }

  let course = info.department;

  // not provided by tap-id
  let section = "No_Section";

  let code: string;
  do {
    code = generateCode();
  } while (await isCodeExists(code));

  // this is the first name btw
  let username =
    email.split("@")[0].split("_")[0].charAt(0).toUpperCase() +
    email.split("@")[0].split("_")[0].slice(1);

  // insert to db
  const response = await insertPlayerData(
    code,
    studentId,
    username,
    fullName,
    email,
    course,
    section
  );
  if (response.error) {
    let responseJson = {
      status: "invalid",
      message: "Failed to register user.",
    };

    return res.send(JSON.stringify(responseJson));
  }

  let responseJson = {
    status: "verified",
    message: "User registered.",
    code: code,
    name: fullName,
  };

  return res.send(JSON.stringify(responseJson));
}); */