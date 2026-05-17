import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../common/mail/mail.service';

function requireEnv(name: 'JWT_SECRET' | 'JWT_REFRESH_SECRET') {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be defined before issuing authentication tokens.`);
  }
  return value;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.usersService.findOne(registerDto.email);
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role || 'TOURIST',
    });

    // Si c'est un opérateur, on crée son profil avec les données métier fournies
    if (user.role === 'OPERATOR') {
      await this.prisma.operator.create({
        data: {
          userId: user.id,
          businessName: registerDto.businessName || `${user.firstName} ${user.lastName}`,
          businessType: registerDto.businessType || 'OTHER',
          description: registerDto.description || 'Profil opérateur à compléter.',
          region: registerDto.region || 'Congo',
          city: registerDto.city || 'À préciser',
          address: registerDto.address || 'À préciser',
          phone: registerDto.phone || '',
          whatsapp: registerDto.whatsapp,
          managerName: registerDto.managerName,
          rccmNumber: registerDto.rccmNumber,
          taxId: registerDto.taxId,
          subscriptionPlan: registerDto.plan as any || 'STARTER',
        },
      });
    }

    // On n'attend pas l'envoi du mail pour ne pas bloquer l'inscription si le service mail est down
    Promise.resolve(this.mailService.sendWelcomeEmail(user.email, user.firstName)).catch((error) => {
      this.logger.warn(`Echec envoi email bienvenue: ${error instanceof Error ? error.message : 'erreur inconnue'}`);
    });

    const { passwordHash, ...result } = user;
    return {
      user: result,
      backend_tokens: await this.generateTokens(user.id, user.email),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...result } = user;
    return {
      user: result,
      backend_tokens: await this.generateTokens(user.id, user.email),
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: requireEnv('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: requireEnv('JWT_REFRESH_SECRET'),
      }),
    ]);

    // Rotation du Refresh Token : on stocke le nouveau token en base
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: requireEnv('JWT_REFRESH_SECRET'),
      });

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token invalide ou révoqué');
      }

      await this.prisma.refreshToken.delete({
        where: { token },
      });

      return this.generateTokens(payload.sub, payload.email);
    } catch (e) {
      throw new UnauthorizedException('Session expirée');
    }
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token },
    });
  }
}
