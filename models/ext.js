const supportFile = () => {
  return [
    { type: "document", lists: ["doc", "ppt", "xls", "docx", "pptx", "xlsx"] },
    { type: "image", lists: ["jpg", "jpeg", "png"] },
    { type: "audio", lists: ["aac", "amr", "mp3", "ogg", "opus"] },
    { type: "application", lists: ["pdf"] }
  ];
}


module.exports = {
  supportFile
}