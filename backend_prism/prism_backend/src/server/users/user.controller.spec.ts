
import { Test } from '@nestjs/testing';
import { IUser } from './iuser.interface';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


describe('UserController', () => {
  let userController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [UsersService],
      }).compile();

      userService = moduleRef.get<UsersService>(UsersService);
      userController = moduleRef.get<UsersController>(UsersController);
  });

  describe(' checks returning admin permissions', () => {

    it('should return admin string', async () => {
      

      let user : Promise<IUser>
      

      jest.spyOn(userService, 'findOneByUsername').mockImplementation(() => user);

      expect(await userController.checkAdminPermission()).toBe("xui");
    });
  });
});
