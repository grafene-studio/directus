import express from 'express';
import asyncHandler from 'express-async-handler';
import PermissionsService from '../services/permissions';
import MetaService from '../services/meta';
import { InvalidCredentialsException } from '../exceptions';

const router = express.Router();

router.post(
	'/',
	asyncHandler(async (req, res, next) => {
		const service = new PermissionsService({ accountability: req.accountability });
		const primaryKey = await service.create(req.body);
		const item = await service.readByKey(primaryKey, req.sanitizedQuery);

		res.locals.payload = { data: item || null };
		return next();
	}),
);

router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		const service = new PermissionsService({ accountability: req.accountability });
		const metaService = new MetaService({ accountability: req.accountability });

		const item = await service.readByQuery(req.sanitizedQuery);
		const meta = await metaService.getMetaForQuery('directus_permissions', req.sanitizedQuery);

		res.locals.payload = { data: item || null, meta };
		return next();
	}),
);

router.get(
	'/me',
	asyncHandler(async (req, res, next) => {
		if (!req.accountability?.user || !req.accountability?.role) {
			throw new InvalidCredentialsException();
		}

		const service = new PermissionsService();
		const query = req.sanitizedQuery || {};

		query.filter = {
			...(query.filter || {}),
			role: {
				_eq: req.accountability.role,
			},
		};

		const items = await service.readByQuery(req.sanitizedQuery);

		res.locals.payload = { data: items || null };
		return next();
	}),
);

router.get(
	'/:pk',
	asyncHandler(async (req, res, next) => {
		const service = new PermissionsService({ accountability: req.accountability });
		const record = await service.readByKey(Number(req.params.pk), req.sanitizedQuery);

		res.locals.payload = { data: record || null };
		return next();
	}),
);

router.patch(
	'/:pk',
	asyncHandler(async (req, res, next) => {
		const service = new PermissionsService({ accountability: req.accountability });
		const primaryKey = await service.update(req.body, Number(req.params.pk));

		const item = await service.readByKey(primaryKey, req.sanitizedQuery);

		res.locals.payload = { data: item || null };
		return next();
	}),
);

router.delete(
	'/:pk',
	asyncHandler(async (req, res, next) => {
		const service = new PermissionsService({ accountability: req.accountability });
		await service.delete(Number(req.params.pk));
		return next();
	}),
);

export default router;
