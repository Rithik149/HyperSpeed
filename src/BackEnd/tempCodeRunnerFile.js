app.post("/upload", upload.single("file"),async (req, res) => {
  const { originalname, filename, destination, size, mimetype } = req.file;

  const ext = path.extname(originalname); //extension
  const base = path.basename(originalname, ext); //name

  const safebase = base.replace(/[^a-zA-Z0-9_]/g, "_"); //sanitize it means that replace something like space to _

  //final name
  const newName = `${safebase}-${Date.now()}${ext}`;

  const oldPath = path.join(destination, filename);
  const newPath = path.join(destination, newName);

  fs.renameSync(oldPath, newPath);

  //code generation
  let code;
  do {
    code = generateCode();
  } while (shareStore.has(code));

  await pool.query(
    `
    INSERT INTO shared_files(code,file_path,original_name,size,mime_type,expires_at) VALUES($1,$2,$3,$4,$5,$6)
    `,
    [code,newPath,newName,size,mimetype,new Date(Date.now() + 10 * 60 * 1000)]
  );
  const expires_at=Date.now()+10*60*1000;
  // shareStore.set(code, {
  //   //its a map dont forget
  //   path: newPath,
  //   name: newName,
  //   size,
  //   type: mimetype,s
  //   expiresAt: Date.now() + 10 * 60 * 1000,
  // });
  // const entry = shareStore.get(code);

  res.json({
    success: true,
    code,
    expiresAt: expires_at,
    file: {
      name: newName,
      size,
      type: mimetype,
    },
  });
});