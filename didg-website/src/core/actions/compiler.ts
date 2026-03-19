"use server";

const JDOODLE_LANGUAGES: Record<string, { lang: string; version: string }> = {
  python: { lang: "python3", version: "3" },
  javascript: { lang: "nodejs", version: "4" },
  cpp: { lang: "cpp17", version: "0" },
  java: { lang: "java", version: "4" },
};

export async function executeCode(
  language: string,
  code: string,
  stdin: string = "",
) {
  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      success: false,
      error: "Faltan las credenciales de JDoodle en el .env.local",
    };
  }

  const langConfig = JDOODLE_LANGUAGES[language];
  if (!langConfig) {
    return {
      success: false,
      error: "Lenguaje no soportado por el motor actual.",
    };
  }

  try {
    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret,
        script: code,
        stdin: stdin,
        language: langConfig.lang,
        versionIndex: langConfig.version,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error de conexión al compilador (${response.status})`);
    }

    const data = await response.json();

    if (data.statusCode === 200) {
      return {
        success: true,
        output: data.output,
        time: data.cpuTime,
        memory: data.memory,
      };
    } else {
      return {
        success: false,
        error: data.error || "Límite de la API alcanzado o error interno.",
      };
    }
  } catch (error: any) {
    console.error("JDoodle Fetch error:", error);
    return {
      success: false,
      error: "Error de red interno. Intenta nuevamente.",
    };
  }
}
