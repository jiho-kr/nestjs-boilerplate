import type {
  AuthData,
  RefreshData,
  RefreshTokenStore,
} from '@smartthings/core-sdk';

export class TokenStore implements RefreshTokenStore {
  public authData?: AuthData;

  constructor(private readonly refreshData: RefreshData) {}

  getRefreshData(): Promise<RefreshData> {
    return Promise.resolve({
      ...this.refreshData,
      refreshToken:
        this.authData?.refreshToken ?? this.refreshData.refreshToken,
    });
  }

  putAuthData(data: AuthData): Promise<void> {
    this.authData = data;
    return Promise.resolve();
  }
}
