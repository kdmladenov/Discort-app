import { PoolConfig } from 'mariadb';

interface PoolConfigCustom extends PoolConfig {
  adminEmail: string;
  adminEmailPassword: string;
}

export default PoolConfigCustom;
