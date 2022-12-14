USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Insert]    Script Date: 9/23/2022 8:40:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 7/30/2022
-- Description: Adds a message.
-- Code Reviewer: 

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


ALTER proc [dbo].[Messages_Insert]
							@Message nvarchar(1000)
						   ,@Subject nvarchar(100)
						   ,@RecipientId int
						   ,@SenderId int
						   ,@DateSent datetime2
						   ,@Id int OUTPUT

as

/*
------------------------Test Code-------------------------------
Declare @Id int
Declare @Message nvarchar(1000) = 'Please remember to clock in.'
		,@Subject nvarchar(100) = 'Reminder'
		,@RecipientId int = '6'
		,@SenderId int = '4'
		,@DateSent datetime2(7) = GETUTCDATE()

Execute dbo.Messages_Insert 
							@Message
						   ,@Subject
						   ,@RecipientId
						   ,@SenderId
						   ,@DateSent
						   ,@Id

Select *
from dbo.Messages
------------------------Test Code-------------------------------
*/

Begin

		Declare @DateCreated datetime2 = GETUTCDATE()

		INSERT INTO [dbo].[Messages]
				   ([Message]
				   ,[Subject]
				   ,[RecipientId]
				   ,[SenderId]
				   ,[DateSent]
				   ,[DateCreated])
			 VALUES
				   (@Message
				   ,@Subject
				   ,@RecipientId
				   ,@SenderId
				   ,@DateSent
				   ,@DateCreated)

			SET     @Id = SCOPE_IDENTITY()

End



