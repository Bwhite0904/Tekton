USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[AdminData_SelectAll]    Script Date: 9/23/2022 8:49:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Brandon White
-- Create date: 2022-09-02
-- Description:	Retrieves admin dashboard data
-- =============================================
ALTER PROC [dbo].[AdminData_SelectAll]
				@FromDate datetime2(7)

AS

/*
-------------------TEST CODE--------------------

Declare @FromDate datetime2(7) = '2022-08-28'

Execute dbo.AdminData_SelectAll
								@FromDate

------------------------------------------------
*/
BEGIN

			DECLARE @Offset int = 0

			DECLARE @Today datetime2(7) = GETUTCDATE()

			Select 
			(SELECT COUNT(1) FROM dbo.Users as u WHERE u.UserStatusId = 1) as TotalActiveUserCount,
			(SELECT COUNT(1) FROM dbo.Users as u WHERE u.UserStatusId = 2) as TotalInactiveUserCount,
			(SELECT COUNT(1) FROM dbo.Users as u) as TotalUserCount,
			(SELECT COUNT(1) FROM dbo.Subcontractors as s WHERE s.IsActive = 1) as totalActiveSubcontractorCount,
			(SELECT COUNT(1) FROM dbo.Subcontractors as s WHERE s.IsActive = 0) as totalInactiveSubcontractorCount,
			(SELECT COUNT(1) FROM dbo.Subcontractors as s) as TotalSubcontractorCount,
			(SELECT COUNT(1) FROM dbo.Organizations) as totalOrganizationCount,
			(SELECT COUNT(1) FROM dbo.Organizations as o WHERE o.IsTrainingProvider = 1) as trainingProviderCount,
			(SELECT COUNT(1) FROM dbo.Users as u WHERE u.DateCreated BETWEEN @FromDate AND @Today) as usersJoined,
			(SELECT COUNT(1) FROM dbo.Subcontractors as s WHERE s.DateCreated BETWEEN @FromDate AND @Today) as subcontractorsJoined,
			(SELECT COUNT(1) FROM dbo.Organizations as o WHERE o.DateCreated BETWEEN @FromDate AND @Today) as organizationsJoined,
			(SELECT o.Id,
					o.OrganizationTypeId,
					o.Name,
					o.Description,
					o.Logo,
					o.EmployeesNumber,
					o.DateCreated
			FROM dbo.Organizations as o
			ORDER BY o.Id DESC
			OFFSET @Offset ROWS
			FETCH NEXT 5 ROWS ONLY
			FOR JSON AUTO) as recentOrganizations

END