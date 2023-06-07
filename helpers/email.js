import nodemailer from "nodemailer";



const emailRegistro = async(usuario) => {
  const { email, token, nombre } = usuario;

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <uptask@uptask.cl>',
    to: email,
    subject: "Uptask - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `
    <p>Hola ${nombre} Comprueba tu cuenta en UpTask </p>

    <p> Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
    </p>

    <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
    `

  })
};

const emailRecuperarClave = async(usuario) => {
  const { email, token, nombre } = usuario;

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <uptask@uptask.cl>',
    to: email,
    subject: "Uptask - Reestablece tu password",
    text: "Reestablece tu passworden UpTask",
    html: `
    <p>Hola ${nombre} has solicitado reestablecer tu password</p>

    <p> Sigue el enlace para generar una nueva contraseña:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Clave</a>
    </p>

    <p>Si tu no solicitaste este email puedes ignorar este mensaje</p>
    `

  })
};

export { emailRegistro, emailRecuperarClave };