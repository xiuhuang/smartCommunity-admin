// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAccessToken() {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken;
}

export function setAccessToken(accessToken) {
  return localStorage.setItem('accessToken', accessToken);
}

export function getLoginName() {
  const loginName = localStorage.getItem('loginName');
  return loginName;
}

export function setLoginName(loginName) {
  return localStorage.setItem('loginName', loginName);
}

export function getUserId() {
  const loginName = localStorage.getItem('userId');
  return loginName;
}

export function setUserId(userId) {
  return localStorage.setItem('userId', userId);
}

export function getCommunityId() {
  const loginName = localStorage.getItem('communityId');
  return loginName;
}

export function setCommunityId(communityId) {
  return localStorage.setItem('communityId', communityId);
}

export function clearAllLocalStorage() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('loginName');
  localStorage.removeItem('gh-authority');
}
